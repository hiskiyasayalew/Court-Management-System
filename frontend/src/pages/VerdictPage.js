import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VerdictPage = () => {
  const [approvedCases, setApprovedCases] = useState([]);
  const [verdicts, setVerdicts] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState({}); // Track submission state per case

  const judge = JSON.parse(localStorage.getItem('judge'));

  useEffect(() => {
    if (!judge?.id) return;

    setLoading(true);
    axios
      .get(`http://localhost:8080/api/judge/approved-cases?judgeId=${judge.id}`)
      .then(res => {
        setApprovedCases(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching approved cases:', err);
        setLoading(false);
      });
  }, [judge?.id]);

  const handleVerdictChange = (caseId, text) => {
    setVerdicts(prev => ({ ...prev, [caseId]: text }));
  };

  const handleSubmitVerdict = async (caseId) => {
    if (!verdicts[caseId] || verdicts[caseId].trim() === '') {
      alert('Please enter a verdict text.');
      return;
    }

    setSubmitting(prev => ({ ...prev, [caseId]: true }));
    
    try {
      await axios.post('http://localhost:8080/api/judge/verdict', {
        caseId,
        verdictText: verdicts[caseId],
      });
      alert('✅ Verdict submitted!');

      // Remove the case from the approvedCases list
      setApprovedCases(prev => prev.filter(c => c.id !== caseId));

      // Remove verdict input for that case
      setVerdicts(prev => {
        const copy = { ...prev };
        delete copy[caseId];
        return copy;
      });
    } catch (err) {
      console.error('Failed to submit verdict:', err);
      alert('❌ Failed to submit verdict.');
    } finally {
      setSubmitting(prev => ({ ...prev, [caseId]: false }));
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Verdict Management</h1>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : approvedCases.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500 text-lg">No approved cases waiting for verdict.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {approvedCases.map(c => (
            <div key={c.id} className="border rounded-lg p-4 bg-white shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold mb-2 text-blue-700">Case #{c.id}</h3>
              <p className="text-gray-600 mb-3 line-clamp-3">{c.caseDescription}</p>

              <textarea
                placeholder="Enter your verdict here..."
                className="w-full border rounded p-2 mt-2 text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition"
                rows={4}
                value={verdicts[c.id] || ''}
                onChange={e => handleVerdictChange(c.id, e.target.value)}
              ></textarea>

              <button
                onClick={() => handleSubmitVerdict(c.id)}
                disabled={submitting[c.id]}
                className={`mt-3 w-full px-4 py-2 rounded text-white font-medium transition ${
                  submitting[c.id] 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {submitting[c.id] ? 'Submitting...' : 'Submit Verdict'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VerdictPage;