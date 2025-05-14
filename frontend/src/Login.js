// Login.js
import React from 'react';
import { Link } from 'react-router-dom';
import loginimage from './assets/lawsymbol2.webp'; // Adjust path as needed
const Login = () => {
  return (
    <div className="bg-white min-h-screen flex items-center justify-center p-4">
      <main className="max-w-6xl w-full flex flex-col md:flex-row items-center md:items-start justify-center gap-12 md:gap-24">
        {/* Image */}
        <section className="flex-shrink-0 max-w-md md:max-w-lg">
          <img
            src={loginimage}
            alt="Illustration"
            className="w-full h-auto"
            width={480}
            height={480}
          />
        </section>

        {/* Form */}
        <section className="w-full max-w-sm">
          <h1 className="text-3xl font-extrabold text-gray-900 leading-tight mb-6">
            Hello,<br />Welcome Back
          </h1>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Username Or Email"
              className="w-full border-b border-gray-300 text-gray-400 placeholder-gray-400 focus:outline-none focus:border-blue-400 pb-2"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full border-b border-gray-300 text-gray-400 placeholder-gray-400 focus:outline-none focus:border-blue-400 pb-2"
            />
            <div className="flex justify-between items-center text-sm text-blue-500">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 border border-gray-300 rounded text-blue-500 focus:ring-blue-400"
                />
                Remember Me
              </label>
              <Link to="/forgot-password" className="hover:underline">
                Forgot Password?
              </Link>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-400 text-white font-semibold py-2 rounded mt-4 hover:bg-blue-500 transition"
            >
              Login
            </button>
          </form>

          {/* Signup Link */}
          <p className="text-xs text-gray-700 mt-6">
            Don't Have An Account?{' '}
            <Link to="/signup" className="text-blue-500 font-semibold hover:underline">
              Signup
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
};

export default Login;
