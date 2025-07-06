import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VerdictPage = () => {
  const [approvedCases, setApprovedCases] = useState([]);
  const [verdicts, setVerdicts] = useState({}); // { caseId: verdictText }

  const judge = JSON.parse(localStorage.getItem('judge'));

  useEffect(() => {
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

  const handleVerdictChange = (caseId, text) => {
    setVerdicts(prev => ({ ...prev, [caseId]: text }));
  };

  const handleSubmitVerdict = async (caseId) => {
    if (!verdicts[caseId]) {
      alert('Please enter a verdict text.');
      return;
    }

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
    }
  };

  return (
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
          </div>
        ))
      )}
    </div>
  );
};

export default VerdictPage;
