// src/pages/AdminLogin.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);

  try {
    const response = await fetch('http://localhost:8080/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.token);
      navigate('/admin'); // navigate immediately
    } else {
      const errorText = await response.text();
      setError(errorText || 'Invalid username or password.');
    }
  } catch (err) {
    console.error('Login error:', err);
    setError('An error occurred. Please try again.');
  } finally {
    setIsLoading(false);
  }
};


  return (
    <motion.div 
      className="bg-gray-50 min-h-screen flex items-center justify-center p-2 xs:p-4 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.main 
        className="w-full max-w-xs xs:max-w-sm sm:max-w-md bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg overflow-hidden mx-2 xs:mx-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="px-4 py-6 xs:px-5 xs:py-7 sm:px-8 sm:py-10">
          <motion.h1 
            className="text-2xl xs:text-2xl sm:text-3xl font-bold xs:font-extrabold text-gray-900 mb-6 xs:mb-7 sm:mb-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Admin Login
          </motion.h1>
          
          {error && (
            <motion.div 
              className="mb-4 p-3 bg-red-50 text-red-700 text-xs xs:text-sm rounded-md"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          <form className="space-y-4 xs:space-y-5 sm:space-y-6" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="username" className="block font-medium text-gray-700 mb-1 text-sm xs:text-base">
                Username <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm xs:text-base focus:outline-none focus:ring-2 focus:ring-[#f25c05]"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block font-medium text-gray-700 mb-1 text-sm xs:text-base">
                Password <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm xs:text-base focus:outline-none focus:ring-2 focus:ring-[#f25c05] pr-10"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="h-4 w-4 xs:h-5 xs:w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4 xs:h-5 xs:w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-[#f25c05] text-white py-2 px-4 rounded-md text-sm xs:text-base sm:text-lg font-semibold hover:bg-[#d14e00] transition ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>
          </form>
        </div>
        
        <motion.div 
          className="bg-gray-50 px-4 py-3 xs:px-5 xs:py-4 sm:px-8 sm:py-4 border-t border-gray-200 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <p className="text-xs xs:text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Court Case Management. All rights reserved.
          </p>
        </motion.div>
      </motion.main>
    </motion.div>
  );
};

export default AdminLogin;
