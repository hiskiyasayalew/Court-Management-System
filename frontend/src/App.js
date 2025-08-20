import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import VerdictPage from './pages/VerdictPage';
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
import AppealForm from './pages/AppealForm'; 
import PrivateRoute from './pages/PrivateRoute';
import HomeGuard from "./guards/HomeGuard";
import PoliceGuard from "./guards/PoliceGuard";
import ProsecutorGuard from "./guards/ProsecutorGuard";
import JudgeGuard from "./guards/JudgeGuard";

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
          <Route path="/home"element={<HomeGuard><HomePage /></HomeGuard>}/>
          <Route path="/login/judge" element={<JudgeLogin />} />
          <Route path="/login/prosecutor" element={<ProsecutorLogin />} />
          <Route path="/login/police" element={<PoliceLogin />} />
          <Route path="/adminlogin" element={<AdminLogin />} />
          
      {/* Other routes... */}
      
          <Route path="/police-home"element={<PoliceGuard><PoliceHome /></PoliceGuard>}/>
          <Route path="/prosecutor/home"element={<ProsecutorGuard><ProsecutorHome /></ProsecutorGuard>}/>
          <Route path="/send-to-prosecutor" element={<PoliceForm />} />
          <Route path="/appliedandrejected" element={<AppliedRejected />} />
          <Route path="/admin" element={<PrivateRoute><AdminPage /></PrivateRoute>} />
          <Route path="/judge/home"element={<JudgeGuard><JudgeHomePage /></JudgeGuard>}/>
          <Route path="/judge/verdicts"element={<VerdictPage/>}/>
          <Route path="/appeal" element={<AppealPage/>} />

          {/* ✅ Add this route for the prosecutor-to-judge form */}
          <Route path="/send-to-judge" element={<ProsecutorToJudgeForm />} />
          <Route path="/appeal-form/:caseId" element={<AppealForm />} /> {/* ✅ Appeal Form route */}
        </Routes>
      </Router>
    </LanguageProvider>
  );
};

export default App;
