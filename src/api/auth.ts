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

export class NetworkError extends Error {
  constructor(message: string = 'Network error. Please check your internet connection and ensure the Supabase project is active.') {
    super(message);
    this.name = 'NetworkError';
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

  try {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1,
      email,
    });

    if (error) {
      // Check if it's a network error
      if (error.message?.includes('Failed to fetch') || error.message?.includes('ERR_NAME_NOT_RESOLVED') || error.message?.includes('NetworkError')) {
        throw new NetworkError();
      }
      throw error;
    }

    return (data?.users?.length ?? 0) > 0;
  } catch (err) {
    // Catch network errors from fetch
    if (err instanceof TypeError && err.message?.includes('Failed to fetch')) {
      throw new NetworkError();
    }
    if (err instanceof NetworkError) {
      throw err;
    }
    throw err;
  }
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

  try {
    const exists = await checkEmailExists(officialEmail);
    if (exists) {
      throw new EmailAlreadyExistsError();
    }
  } catch (err) {
    // If checkEmailExists throws NetworkError, propagate it
    if (err instanceof NetworkError) {
      throw err;
    }
    // If it's EmailAlreadyExistsError, re-throw it
    if (err instanceof EmailAlreadyExistsError) {
      throw err;
    }
    // For other errors, continue (we'll rely on signUp to surface duplicates)
  }

  try {
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
      // Check if it's a network error
      if (signUpError.message?.includes('Failed to fetch') || signUpError.message?.includes('ERR_NAME_NOT_RESOLVED') || signUpError.message?.includes('NetworkError')) {
        throw new NetworkError();
      }
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
      // Check if it's a network error
      if (profileError.message?.includes('Failed to fetch') || profileError.message?.includes('ERR_NAME_NOT_RESOLVED')) {
        throw new NetworkError();
      }
      throw profileError;
    }

    return {
      session,
      user,
      profile: profileData,
    };
  } catch (err) {
    // Catch network errors from fetch
    if (err instanceof TypeError && err.message?.includes('Failed to fetch')) {
      throw new NetworkError();
    }
    // Re-throw if it's already a known error type
    if (err instanceof NetworkError || err instanceof EmailAlreadyExistsError || err instanceof PasswordsDoNotMatchError) {
      throw err;
    }
    // Re-throw other errors
    throw err;
  }
}

export async function loginBrand(payload: BrandLoginPayload): Promise<BrandAuthResult> {
  const { email, password } = payload;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Check if it's a network error first
      if (error.message?.includes('Failed to fetch') || error.message?.includes('ERR_NAME_NOT_RESOLVED') || error.message?.includes('NetworkError')) {
        throw new NetworkError();
      }

      // Distinguish invalid user vs wrong password using admin listUsers
      if (supabaseAdmin) {
        try {
          const exists = await checkEmailExists(email);
          if (!exists) {
            throw new InvalidUserError();
          }
          throw new WrongPasswordError();
        } catch (err) {
          // If checkEmailExists throws NetworkError, propagate it
          if (err instanceof NetworkError) {
            throw err;
          }
          // Otherwise, re-throw the original error
          throw error;
        }
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
      // Check if it's a network error
      if (profileError.message?.includes('Failed to fetch') || profileError.message?.includes('ERR_NAME_NOT_RESOLVED')) {
        throw new NetworkError();
      }
      throw profileError;
    }

    return {
      user,
      session,
      profile,
    };
  } catch (err) {
    // Catch network errors from fetch
    if (err instanceof TypeError && err.message?.includes('Failed to fetch')) {
      throw new NetworkError();
    }
    // Re-throw if it's already a known error type
    if (err instanceof NetworkError || err instanceof InvalidUserError || err instanceof WrongPasswordError) {
      throw err;
    }
    // Re-throw other errors
    throw err;
  }
}


