import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signUpBrand, EmailAlreadyExistsError, PasswordsDoNotMatchError } from '../../api/auth';

const BrandSignup: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    brandName: '',
    firstName: '',
    lastName: '',
    officialEmail: '',
    mobileNumber: '',
    designation: '',
    industryCategory: '',
    numberOfEmployees: '',
    password: '',
    confirmPassword: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.officialEmail || !form.password || !form.confirmPassword || !form.brandName) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await signUpBrand({
        brandName: form.brandName,
        firstName: form.firstName,
        lastName: form.lastName,
        officialEmail: form.officialEmail,
        mobileNumber: form.mobileNumber,
        designation: form.designation,
        industryCategory: form.industryCategory,
        numberOfEmployees: form.numberOfEmployees,
        password: form.password,
        confirmPassword: form.confirmPassword,
      });

      // You can persist session/profile to a global store here if needed.
      if (result.session && result.profile) {
        navigate('/');
      } else {
        navigate('/auth/login');
      }
    } catch (err) {
      if (err instanceof EmailAlreadyExistsError) {
        setError('Email already exists');
      } else if (err instanceof PasswordsDoNotMatchError) {
        setError('Passwords do not match');
      } else if (err instanceof Error) {
        setError(err.message || 'Something went wrong during signup.');
      } else {
        setError('Something went wrong during signup.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-8 space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">Create your Brand Account</h1>
          <p className="text-sm text-gray-500">
            Sign up to Stegofy Studio to manage your products, QR codes and consumer journeys.
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Brand Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="brandName"
                value={form.brandName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                placeholder="Acme Foods Pvt Ltd"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Industry Category</label>
              <input
                type="text"
                name="industryCategory"
                value={form.industryCategory}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                placeholder="Packaged Foods, Beverages, Personal Care..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                placeholder="Your first name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                placeholder="Your last name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Official Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="officialEmail"
                value={form.officialEmail}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                placeholder="you@brand.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
              <input
                type="tel"
                name="mobileNumber"
                value={form.mobileNumber}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                placeholder="+91 98765 43210"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Designation</label>
              <input
                type="text"
                name="designation"
                value={form.designation}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                placeholder="Brand Manager, Founder..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Number of Employees</label>
              <input
                type="text"
                name="numberOfEmployees"
                value={form.numberOfEmployees}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                placeholder="1-10, 11-50, 51-200..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                placeholder="Create a strong password"
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                placeholder="Re-enter your password"
                required
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex justify-center items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating account...' : 'Sign up'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/auth/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default BrandSignup;


