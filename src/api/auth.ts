import { AuthError, Session, User } from '@supabase/supabase-js';
import { BrandProfile, supabase, supabaseAdmin } from '../lib/supabase';

export interface BrandSignupPayload {
  brandName: string;
  firstName: string;
  lastName: string;
  officialEmail: string;
  mobileNumber: string;
  designation: string;
  industryCategory: string;
  numberOfEmployees: string;
  password: string;
  confirmPassword: string;
}

export interface BrandLoginPayload {
  email: string;
  password: string;
}

export interface BrandAuthResult {
  session: Session | null;
  user: User | null;
  profile: BrandProfile | null;
}

export class EmailAlreadyExistsError extends Error {
  constructor() {
    super('Email already exists');
    this.name = 'EmailAlreadyExistsError';
  }
}

export class PasswordsDoNotMatchError extends Error {
  constructor() {
    super('Passwords do not match');
    this.name = 'PasswordsDoNotMatchError';
  }
}

export class InvalidUserError extends Error {
  constructor() {
    super('Invalid user');
    this.name = 'InvalidUserError';
  }
}

export class WrongPasswordError extends Error {
  constructor() {
    super('Wrong password');
    this.name = 'WrongPasswordError';
  }
}

/**
 * Check if an email already exists in Supabase Auth using auth.admin.listUsers.
 * This requires an admin client (service role key).
 */
export async function checkEmailExists(email: string): Promise<boolean> {
  if (!supabaseAdmin) {
    // Without an admin client we cannot safely check from the browser.
    // We fall back to "no match" and rely on signUp to surface duplicates.
    return false;
  }

  const { data, error } = await supabaseAdmin.auth.admin.listUsers({
    page: 1,
    perPage: 1,
    email,
  });

  if (error) {
    throw error;
  }

  return (data?.users?.length ?? 0) > 0;
}

export async function signUpBrand(payload: BrandSignupPayload): Promise<BrandAuthResult> {
  const {
    brandName,
    firstName,
    lastName,
    officialEmail,
    mobileNumber,
    designation,
    industryCategory,
    numberOfEmployees,
    password,
    confirmPassword,
  } = payload;

  if (password !== confirmPassword) {
    throw new PasswordsDoNotMatchError();
  }

  const exists = await checkEmailExists(officialEmail);
  if (exists) {
    throw new EmailAlreadyExistsError();
  }

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: officialEmail,
    password,
    options: {
      data: {
        brand_name: brandName,
        first_name: firstName,
        last_name: lastName,
        designation,
        industry_category: industryCategory,
        number_of_employees: numberOfEmployees,
        mobile_number: mobileNumber,
      },
    },
  });

  if (signUpError) {
    if ((signUpError as AuthError).message?.toLowerCase().includes('already registered')) {
      throw new EmailAlreadyExistsError();
    }
    throw signUpError;
  }

  const user = signUpData.user;
  const session = signUpData.session ?? null;

  if (!user) {
    return { user: null, session, profile: null };
  }

  const profilePayload: Omit<BrandProfile, 'created_at' | 'updated_at'> = {
    id: user.id,
    brand_name: brandName,
    first_name: firstName,
    last_name: lastName,
    official_email: officialEmail,
    mobile_number: mobileNumber || null,
    designation: designation || null,
    industry_category: industryCategory || null,
    number_of_employees: numberOfEmployees || null,
  };

  const { data: profileData, error: profileError } = await supabase
    .from('brand_profiles')
    .insert(profilePayload)
    .select('*')
    .single<BrandProfile>();

  if (profileError) {
    throw profileError;
  }

  return {
    session,
    user,
    profile: profileData,
  };
}

export async function loginBrand(payload: BrandLoginPayload): Promise<BrandAuthResult> {
  const { email, password } = payload;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Distinguish invalid user vs wrong password using admin listUsers
    if (supabaseAdmin) {
      const exists = await checkEmailExists(email);
      if (!exists) {
        throw new InvalidUserError();
      }
      throw new WrongPasswordError();
    }

    // Fallback: bubble up the generic error
    throw error;
  }

  const user = data.user ?? null;
  const session = data.session ?? null;

  if (!user) {
    throw new InvalidUserError();
  }

  const { data: profile, error: profileError } = await supabase
    .from('brand_profiles')
    .select('*')
    .eq('id', user.id)
    .single<BrandProfile>();

  if (profileError) {
    throw profileError;
  }

  return {
    user,
    session,
    profile,
  };
}


