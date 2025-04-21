import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import AuthImagePattern from '../components/AuthImagePattern';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const LoginPage = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
      email: '',
      password: '',
    })
  
    const { login, isLogingIn } = useAuthStore()
    

    const HandleSubmit = (e) => {
        e.preventDefault();
        login(formData);
    
      }

  return (
    <div className='min-h-screen grid lg:grid-cols-2'>
      {/* left side */}
      <div className='flex flex-col items-center justify-center p-6 sm:p-12'>
        <div className='w-full max-w-md space-y-8'>
          <div className='text-center'>
            <h1 className='text-2xl font-bold'>Login</h1>
            <p className='mt-2 text-sm text-gray-600'>Welcome back! Please login to your account.</p>
          </div>
          <form onSubmit={HandleSubmit} className='space-y-6'>
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
            <button type="submit" disabled={isLogingIn} className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isLogingIn && 'opacity-50 cursor-not-allowed'}`}>
              {isLogingIn ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className='space-y-2 text-center text-sm text-gray-600'>
            <p>Don't have an account? <Link to="/signup" className='text-blue-600 hover:underline'>Sign Up</Link></p>
            <p>Forgot your password? <Link to="/reset-password" className='text-blue-600 hover:underline'>Reset it</Link></p>
            <p>By signing in, you agree to our <Link to="/terms" className='text-blue-600 hover:underline'>Terms of Service</Link> and <Link to="/privacy" className='text-blue-600 hover:underline'>Privacy Policy</Link>.</p>
          </div>  
        </div>
      </div>

      {/* right side */}
      <AuthImagePattern
        title="Welcome back to our platform!"
        subtitle="Please login to continue your journey with us. We are glad to have you back!"
        
      />
      
    </div>
      
  )
}

export default LoginPage