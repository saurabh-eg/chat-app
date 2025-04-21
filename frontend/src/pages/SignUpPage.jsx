import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import AuthImagePattern from '../components/AuthImagePattern';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const SignUpPage = () => {

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
  })

  const { signup, isSigingUp } = useAuthStore()

  const validateForm = () => {
    const { fullname, email, password } = formData;
    if (!fullname) {
      return toast.error("Fullname is required.");
    }
    if (!email) {
      return toast.error("Email is required.");
    }
    if (!password) {
      return toast.error("Password is required.");
    }
    if (fullname.length < 3) {
      return toast.error("Fullname must be at least 3 characters long.");
    }
    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters long.");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return toast.error("Invalid email format.");
    }
    return true;
  }
  const HandleSubmit = (e) => {
    e.preventDefault();

    const success = validateForm();
    if (success === true) signup(formData);

  }


  return (
    <div className='min-h-screen grid lg:grid-cols-2'>
      {/* left side */}

      <div className='flex flex-col items-center justify-center p-6 sm:p-12'>
        <div className='w-full max-w-md space-y-8'>
          <div className='text-center'>
            <h1 className='text-2xl font-bold'>Sign Up</h1>
            <p className='mt-2 text-sm text-gray-600'>Create an account to get started.</p>
          </div>

          <form onSubmit={HandleSubmit} className='space-y-4'>
            {/* Full Name */}
            <div>
              <label htmlFor="fullname" className='block text-sm font-medium'>Full Name</label>
              <input type="text" placeholder="shashi kumar" id="fullname" value={formData.fullname} onChange={(e) => setFormData({ ...formData, fullname: e.target.value })} required className='mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500' />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className='block text-sm font-medium'>Email</label>
              <input type="email" placeholder="you@example.com" id="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className='mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500' />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className='block text-sm font-medium'>Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className='mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 pr-10'
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-2 top-1/2 -translate-y-1/2'
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={isSigingUp} className={`w-full py-2 px-4 bg-blue-600 text-white rounded-md ${isSigingUp && 'opacity-50 cursor-not-allowed'}`}>
              {isSigingUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          
          <p className='text-sm text-center text-gray-600'>Already have an account? <Link to="/login" className='text-blue-500'>Login</Link></p>
        </div>
      </div>

      {/* right side */}
      <AuthImagePattern
        title="Welcome to Our Platform"
        subtitle="Join us and explore the amazing features we offer. Sign up now to get started!"
      />

    </div>
  )
}

export default SignUpPage