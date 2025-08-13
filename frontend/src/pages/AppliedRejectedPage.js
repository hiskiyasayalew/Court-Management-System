import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const AppliedRejectedPage = () => {
  const navigate = useNavigate();
  const [approvedCases, setApprovedCases] = useState([]);
  const [rejectedCases, setRejectedCases] = useState([]);
  const [view, setView] = useState('approved'); // Track the current view

  useEffect(() => {
    // Fetch approved cases
    fetch("http://localhost:8080/api/police/approved-cases")
      .then(res => res.json())
      .then(setApprovedCases)
      .catch(err => console.error("Error loading approved cases:", err));

    // Fetch rejected cases
    fetch("http://localhost:8080/api/police/rejected-cases")
      .then(res => res.json())
      .then(setRejectedCases)
      .catch(err => console.error("Error loading rejected cases:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-blue-700 mb-4 sm:mb-6">
        Approved and Rejected Cases
      </h1>

      <div className="flex justify-end mb-4 sm:mb-6">
        <motion.button
          onClick={() => setView('approved')}
          className={`mr-2 ${view === 'approved' ? 'bg-[#f25c05]' : 'bg-gray-300'} text-white px-3 py-1 sm:px-4 sm:py-2 rounded transition duration-300 text-sm sm:text-base`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Approved
        </motion.button>
        <motion.button
          onClick={() => setView('rejected')}
          className={`${view === 'rejected' ? 'bg-[#f25c05]' : 'bg-gray-300'} text-white px-3 py-1 sm:px-4 sm:py-2 rounded transition duration-300 text-sm sm:text-base`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Rejected
        </motion.button>
      </div>

      {view === 'approved' ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {approvedCases.length === 0 ? (
            <p className="text-center text-gray-600 text-sm sm:text-base">No approved cases.</p>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {approvedCases.map((c) => (
                <motion.div
                  key={c.id}
                  className="bg-white p-3 sm:p-4 rounded-lg shadow-md"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <h2 className="text-lg sm:text-xl font-bold">{c.fullName}</h2>
                  <p className="text-gray-600 text-sm sm:text-base">{c.caseType}</p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {new Date(c.submittedAt).toLocaleString()}
                  </p>
                </motion.div>
              ))}
          
            </div>
          )}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {rejectedCases.length === 0 ? (
            <p className="text-center text-gray-600 text-sm sm:text-base">No rejected cases.</p>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {rejectedCases.map((c) => (
                <motion.div
                  key={c.id}
                  className="bg-white p-3 sm:p-4 rounded-lg shadow-md"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <h2 className="text-lg sm:text-xl font-bold">{c.fullName}</h2>
                  <p className="text-gray-600 text-sm sm:text-base">{c.caseType}</p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {new Date(c.submittedAt).toLocaleString()}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default AppliedRejectedPage;