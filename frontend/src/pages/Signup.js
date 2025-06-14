import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import signupimage from '../assets/lawsymbol2.webp';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { register } from '../api';

const Signup = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    passWord: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    city: '',
    subCity: ''
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.passWord !== formData.confirmPassword) {
      alert(t.passwordMismatch);
      return;
    }

    try {
      await register(formData);
      alert(t.signupSuccess);
      navigate('/login');
    } catch (err) {
      console.error(err);
      alert(t.signupFail);
    }
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center p-4 relative">
      <LanguageSwitcher />
      <main className="max-w-6xl w-full flex flex-col md:flex-row items-center md:items-start justify-center gap-12 md:gap-24">
        <section className="flex-shrink-0 max-w-md md:max-w-lg">
          <img src={signupimage} alt="Illustration" className="w-full h-auto" />
        </section>

        <section className="w-full max-w-sm">
          <h1 className="text-3xl font-extrabold text-gray-900 leading-tight mb-6">
            {t.signupTitle}
          </h1>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input type="text" name="userName" value={formData.userName} onChange={handleChange} placeholder={t.username} className="w-full border-b pb-2" />
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder={t.email} className="w-full border-b pb-2" />
            <input type="password" name="passWord" value={formData.passWord} onChange={handleChange} placeholder={t.password} className="w-full border-b pb-2" />
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder={t.confirmPassword} className="w-full border-b pb-2" />
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder={t.firstName} className="w-full border-b pb-2" />
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder={t.lastName} className="w-full border-b pb-2" />
            <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder={t.phoneNumber} className="w-full border-b pb-2" />
            <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder={t.city} className="w-full border-b pb-2" />
            <input type="text" name="subCity" value={formData.subCity} onChange={handleChange} placeholder={t.subCity} className="w-full border-b pb-2" />
            <button type="submit" className="w-full bg-blue-400 text-white font-semibold py-2 rounded mt-4 hover:bg-blue-500 transition">
              {t.signup}
            </button>
          </form>
          <p className="text-xs text-gray-700 mt-6">
            {t.alreadyHaveAccount}{' '}
            <Link to="/login" className="text-blue-500 font-semibold hover:underline">{t.login}</Link>
          </p>
        </section>
      </main>
    </div>
  );
};

export default Signup;
