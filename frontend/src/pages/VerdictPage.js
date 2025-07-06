import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const VerdictPage = () => {
  const [approvedCases, setApprovedCases] = useState([]);
<<<<<<< HEAD
  const [verdicts, setVerdicts] = useState({}); // { caseId: verdictText }
=======
  const [verdicts, setVerdicts] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState({});
>>>>>>> 0c256667e7cfbda15ead2737b75cc1ff68b370db

  const judge = JSON.parse(localStorage.getItem('judge'));

  useEffect(() => {
<<<<<<< HEAD
    if (!judge?.id) return;

    axios
      .get(`http://localhost:8080/api/judge/approved-cases?judgeId=${judge.id}`)
      .then(res => {
        console.log('Approved cases:', res.data); // Debug: check response shape
        setApprovedCases(res.data);
      })
      .catch(err => {
        console.error('Error fetching approved cases:', err);
      });
  }, [judge?.id]);
=======
    const fetchCases = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/judge/approved-cases?judgeId=${judge.id}`
        );
        setApprovedCases(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, [judge.id]);
>>>>>>> 0c256667e7cfbda15ead2737b75cc1ff68b370db

  const handleVerdictChange = (caseId, text) => {
    setVerdicts(prev => ({ ...prev, [caseId]: text }));
  };

  const handleSubmitVerdict = async (caseId) => {
    if (!verdicts[caseId]?.trim()) {
      alert('Please enter a verdict text.');
      return;
    }
<<<<<<< HEAD

=======
    
    setSubmitting(prev => ({ ...prev, [caseId]: true }));
    
>>>>>>> 0c256667e7cfbda15ead2737b75cc1ff68b370db
    try {
      await axios.post('http://localhost:8080/api/judge/verdict', {
        caseId,
        verdictText: verdicts[caseId],
      });
<<<<<<< HEAD
      alert('✅ Verdict submitted!');

      // Remove the case from the approvedCases list
      setApprovedCases(prev => prev.filter(c => c.id !== caseId));

      // Remove verdict input for that case
      setVerdicts(prev => {
        const copy = { ...prev };
        delete copy[caseId];
        return copy;
      });
=======
      
      // Animate the removal
      setTimeout(() => {
        setApprovedCases(prev => prev.filter(c => c.caseId !== caseId));
        const newVerdicts = { ...verdicts };
        delete newVerdicts[caseId];
        setVerdicts(newVerdicts);
      }, 500);
      
>>>>>>> 0c256667e7cfbda15ead2737b75cc1ff68b370db
    } catch (err) {
      console.error('Failed to submit verdict:', err);
      alert('❌ Failed to submit verdict.');
    } finally {
      setSubmitting(prev => ({ ...prev, [caseId]: false }));
    }
  };

  return (
<<<<<<< HEAD
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Verdict Page</h1>

      {approvedCases.length === 0 ? (
        <p>No approved cases waiting for verdict.</p>
      ) : (
        approvedCases.map(c => (
          <div key={c.id} className="border rounded p-4 mb-4 bg-white shadow">
            <p><strong>Case ID:</strong> {c.id}</p>
            <p><strong>Details:</strong> {c.caseDescription}</p>

            <textarea
              placeholder="Enter verdict..."
              className="w-full border rounded p-2 mt-2"
              rows={4}
              value={verdicts[c.id] || ''}
              onChange={e => handleVerdictChange(c.id, e.target.value)}
            ></textarea>

            <button
              onClick={() => handleSubmitVerdict(c.id)}
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Submit Verdict
            </button>
=======
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto"
      >
        <div className="text-center mb-12">
          <motion.h1 
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Verdict Management
          </motion.h1>
          <motion.p
            className="text-lg text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Review approved cases and submit your verdicts
          </motion.p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f25c05]"></div>
>>>>>>> 0c256667e7cfbda15ead2737b75cc1ff68b370db
          </div>
        ) : approvedCases.length === 0 ? (
          <motion.div
            className="bg-white rounded-xl shadow-md p-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <img 
              src="https://cdn-icons-png.flaticon.com/512/4076/4076478.png" 
              alt="No cases" 
              className="w-24 h-24 mx-auto mb-4 opacity-70"
            />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No pending cases</h3>
            <p className="text-gray-500">There are currently no approved cases waiting for your verdict.</p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {approvedCases.map((c) => (
                <motion.div
                  key={c.caseId}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
                >
                  <div className="p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          Case ID: <span className="text-[#f25c05]">{c.caseId}</span>
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Filed on: {new Date(c.filingDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="bg-blue-50 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                        {c.caseType}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Case Details:</h4>
                      <p className="text-gray-600 whitespace-pre-line">{c.details}</p>
                    </div>

                    <div className="mb-6">
                      <label htmlFor={`verdict-${c.caseId}`} className="block text-sm font-medium text-gray-700 mb-2">
                        Your Verdict
                      </label>
                      <textarea
                        id={`verdict-${c.caseId}`}
                        placeholder="Enter your detailed verdict here..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f25c05] focus:border-[#f25c05] transition"
                        rows={5}
                        value={verdicts[c.caseId] || ''}
                        onChange={(e) => handleVerdictChange(c.caseId, e.target.value)}
                      />
                    </div>

                    <div className="flex justify-end">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSubmitVerdict(c.caseId)}
                        disabled={submitting[c.caseId]}
                        className={`px-6 py-2 rounded-lg font-medium text-white ${
                          submitting[c.caseId] 
                            ? 'bg-gray-400' 
                            : 'bg-[#f25c05] hover:bg-[#d14e00]'
                        } transition flex items-center gap-2`}
                      >
                        {submitting[c.caseId] ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Submit Verdict
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default VerdictPage;