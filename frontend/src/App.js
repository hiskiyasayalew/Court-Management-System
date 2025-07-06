import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';

import Login from './pages/Login';
import Signup from './pages/Signup';
import HomePage from './pages/HomePage';
import LandingPage from './pages/LandingPage';
import ProsecutorLogin from './pages/ProsecutorLogin';
import PoliceLogin from './pages/PoliceLogin';
import JudgeLogin from './pages/JudgeLogin';
import ApplyForm from './pages/ApplyForm';
import AdminLogin from './pages/AdminLogin';
import MyCases from './pages/MyCases';
import PoliceHome from './pages/PoliceHomePage';
import ProsecutorHome from './pages/ProsecutorHomePage';
import PoliceForm from './pages/PoliceForm';
import AppliedRejected from './pages/AppliedRejectedPage';
import AdminPage from './pages/AdminPage';
import JudgeHomePage from './pages/JudgeHomePage';
import AppealPage from './pages/AppealPage';
import ProsecutorToJudgeForm from './pages/ProsecutorToJudgeForm';
import VerdictPage from './pages/VerdictPage';
import AppealForm from './pages/AppealForm'; // ✅ Make sure this is imported

const App = () => {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/landingpage" />} />
          <Route path="/landingpage" element={<LandingPage />} />
          <Route path="/applyform" element={<ApplyForm />} />
          <Route path="/mycases" element={<MyCases />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login/judge" element={<JudgeLogin />} />
          <Route path="/login/prosecutor" element={<ProsecutorLogin />} />
          <Route path="/login/police" element={<PoliceLogin />} />
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route path="/police-home" element={<PoliceHome />} />
          <Route path="/prosecutor/home" element={<ProsecutorHome />} />
          <Route path="/send-to-prosecutor" element={<PoliceForm />} />
          <Route path="/appliedandrejected" element={<AppliedRejected />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/judge/home" element={<JudgeHomePage />} />
          <Route path="/appeal" element={<AppealPage />} />
          <Route path="/send-to-judge" element={<ProsecutorToJudgeForm />} />
          <Route path="/judge/verdicts" element={<VerdictPage />} />
          <Route path="/appeal-form/:caseId" element={<AppealForm />} /> {/* ✅ Appeal Form route */}
        </Routes>
      </Router>
    </LanguageProvider>
  );
};

export default App;
