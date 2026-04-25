import React, { useState } from 'react';
import { FaUserCircle, FaFacebookF, FaYoutube, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useRegisterUserMutation } from "../features/api/authApi";
import { setCredentials } from "../features/auth/authSlice";
import toast from 'react-hot-toast';

export const Signin: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State Management
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'support_partner' | 'patient'>('patient');
  const [contactPhone, setContactPhone] = useState('');
  const [address, setAddress] = useState('');

  const [registerError, setRegisterError] = useState<string | null>(null);

  // RTK Query Mutation (Points to http://localhost:5000/api/auth/register)
  const [registerUser, { isLoading: isRegistering }] = useRegisterUserMutation();

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setRegisterError(null);

    try {
      // Send data to backend - roles match your Drizzle schema
      const response = await registerUser({
        firstName,
        lastName,
        email,
        password,
        role,
        contactPhone,
        address,
      }).unwrap();

      // Update Redux state with the user and token returned from backend
      dispatch(setCredentials({
        token: response.token,
        user: response.user,
      }));

      toast.success("Registration successful! Welcome to the revival.");

      // Navigate straight to dashboard since the user is already authenticated
      navigate('/dashboard');

    } catch (error: any) {
      // Safely extract error message from backend response
      const message = error?.data?.message || "An error occurred during registration.";
      setRegisterError(message);
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-inter">
      <div className='grid md:grid-cols-4 gap-0 max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-teal-100'>

        {/* Form Section */}
        <div className="md:col-span-3 p-8 sm:p-12 flex flex-col justify-center">
          <header className='w-full text-left mb-8'>
            <h1 className='text-teal-700 text-4xl font-black tracking-tight'>DRUG-REVIVE</h1>
            <p className='text-gray-500 text-lg mt-2'>Your journey to a healthier tomorrow starts here.</p>
          </header>

          <div className="flex items-center mb-8">
            <div className="bg-teal-100 p-3 rounded-2xl mr-4">
              <FaUserCircle className='h-8 w-8 text-teal-600' />
            </div>
            <div>
              <h2 className='text-2xl font-bold text-gray-900'>Create account</h2>
              <p className='text-teal-600 font-medium text-sm'>Step into a supported recovery path.</p>
            </div>
          </div>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleRegister}>
            {/* First Name */}
            <div className="space-y-1">
              <label htmlFor="firstname" className="block text-sm font-semibold text-gray-700">First Name</label>
              <input
                id="firstname"
                type='text'
                required
                placeholder="Jane"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                disabled={isRegistering}
              />
            </div>

            {/* Last Name */}
            <div className="space-y-1">
              <label htmlFor='lastname' className='block text-sm font-semibold text-gray-700'>Last Name</label>
              <input
                id='lastname'
                type='text'
                required
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                disabled={isRegistering}
              />
            </div>

            {/* Email */}
            <div className="md:col-span-2 space-y-1">
              <label htmlFor='email' className='block text-sm font-semibold text-gray-700'>Email Address</label>
              <input
                id='email'
                type='email'
                required
                placeholder="jane@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                disabled={isRegistering}
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label htmlFor='password' className='block text-sm font-semibold text-gray-700'>Password</label>
              <input
                id='password'
                type='password'
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                disabled={isRegistering}
              />
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label htmlFor='contactPhone' className='block text-sm font-semibold text-gray-700'>Phone Number</label>
              <input
                id='contactPhone'
                type='tel'
                required
                placeholder="+254..."
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                disabled={isRegistering}
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2 space-y-1">
              <label htmlFor='address' className='block text-sm font-semibold text-gray-700'>Residential Address</label>
              <input
                id='address'
                type='text'
                required
                placeholder="City, Estate"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                disabled={isRegistering}
              />
            </div>

            {/* Role Selection */}
            <div className="md:col-span-2 space-y-1">
              <label htmlFor='role' className='block text-sm font-semibold text-gray-700'>Register as</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as 'admin' | 'support_partner' | 'patient')}
                className="block w-full px-4 py-3 border border-gray-300 rounded-xl bg-teal-50 focus:ring-2 focus:ring-teal-500 outline-none transition-all font-medium text-teal-800"
                disabled={isRegistering}
              >
                <option value="patient">Patient (Recovering Member)</option>
                <option value="support_partner">Support Partner (Caregiver/Friend)</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            {/* Error Message Display */}
            {registerError && (
              <div className="md:col-span-2 bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-100 font-medium">
                {registerError}
              </div>
            )}

            {/* Submit Buttons */}
            <div className="md:col-span-2 pt-4 flex flex-col space-y-3">
              <button
                type="submit"
                className="w-full py-4 px-4 rounded-xl text-lg font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-lg shadow-teal-100 transition-all active:scale-95 disabled:opacity-50"
                disabled={isRegistering}
              >
                {isRegistering ? 'CREATING ACCOUNT...' : 'JOIN THE REVIVAL'}
              </button>

              <button
                type="button"
                className="w-full flex justify-center items-center py-3 px-4 border border-gray-200 rounded-xl text-md font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-all"
                disabled={isRegistering}
              >
                <FcGoogle className="mr-2 text-2xl" /> Sign up with Google
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Already a member?{' '}
              <a href="/login" className="font-bold text-teal-700 hover:underline underline-offset-4">Sign in here</a>
            </p>
          </div>
        </div>

        {/* Sidebar Section */}
        <div className="md:col-span-1 bg-teal-700 p-10 flex flex-col items-center justify-between text-white">
          <div className="text-center space-y-4 mt-10">
            <h2 className="text-2xl font-bold">Stay Connected</h2>
            <p className="text-teal-100 text-sm">Join our community across social platforms for daily motivation and support.</p>
          </div>

          <div className="flex flex-col space-y-6">
            {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube].map((Icon, index) => (
              <a key={index} href="#" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 rounded-2xl bg-teal-600/50 hover:bg-teal-500 transition-all border border-teal-400/30">
                <Icon className="text-white text-xl" />
              </a>
            ))}
          </div>

          <div className="text-xs text-teal-200/60 mb-4">
            © 2026 Drug-Revive
          </div>
        </div>

      </div>
    </div>
  );
};

export default Signin;