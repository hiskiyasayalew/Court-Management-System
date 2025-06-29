import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const ProsecutorToJudgeForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const passedCase = location.state?.caseData;

  const [caseId, setCaseId] = useState('');
  const [prosecutor, setProsecutor] = useState(null);
  const [judges, setJudges] = useState([]);
  const [selectedJudge, setSelectedJudge] = useState('');
  const [details, setDetails] = useState('');
  const [evidenceSummary, setEvidenceSummary] = useState('');
  const [witnesses, setWitnesses] = useState('');
  const [caseFiles, setCaseFiles] = useState([]);
  const [evidenceFiles, setEvidenceFiles] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (passedCase?.id) {
      setCaseId(String(passedCase.id));  // cast to string just in case
    }

    // Load logged-in prosecutor info from localStorage
    const storedProsecutor = JSON.parse(localStorage.getItem('prosecutor'));
    setProsecutor(storedProsecutor);

    // Fetch judges for dropdown
    axios.get('http://localhost:8080/api/prosecutor/judges')
      .then(res => {
        if (Array.isArray(res.data)) {
          setJudges(res.data);
        }
      })
      .catch(err => console.error('Failed to load judges', err));
  }, [passedCase]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!prosecutor) {
      setMessage('Prosecutor info missing');
      return;
    }
    if (!selectedJudge) {
      setMessage('Please select a judge');
      return;
    }

    const formData = new FormData();
    formData.append('caseId', String(caseId));
    formData.append('prosecutorId', String(prosecutor.id));
    formData.append('judgeId', String(selectedJudge));
    formData.append('details', details);
    formData.append('evidenceSummary', evidenceSummary);
    formData.append('witnesses', witnesses);

    caseFiles.forEach(file => formData.append('caseFiles', file));
    evidenceFiles.forEach(file => formData.append('evidenceFiles', file));

    try {
      await axios.post('http://localhost:8080/api/prosecutor/send-to-judge', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage('✅ Form sent to judge successfully');
      navigate('/prosecutor-home');
    } catch (err) {
      console.error("Error sending form:", err.response || err);
      setMessage('❌ Failed to send form: ' + (err.response?.data || err.message || 'Unknown error'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center p-6">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">Send Case to Judge</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold">Case ID:</label>
            <input
              type="text"
              value={caseId}
              readOnly
              className="w-full border p-2 rounded bg-gray-200"
            />
          </div>

          <div>
            <label className="block font-semibold">Select Judge:</label>
            <select
              value={selectedJudge}
              onChange={(e) => setSelectedJudge(e.target.value)}
              required
              className="w-full border p-2 rounded"
            >
              <option value="">-- Select Judge --</option>
              {judges.map(j => (
                <option key={j.id} value={j.id}>{j.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold">Details:</label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              required
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold">Evidence Summary:</label>
            <textarea
              value={evidenceSummary}
              onChange={(e) => setEvidenceSummary(e.target.value)}
              required
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold">Witnesses:</label>
            <textarea
              value={witnesses}
              onChange={(e) => setWitnesses(e.target.value)}
              required
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold">Upload Case Files:</label>
            <input
              type="file"
              multiple
              onChange={(e) => setCaseFiles(Array.from(e.target.files))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block font-semibold">Upload Evidence Files:</label>
            <input
              type="file"
              multiple
              onChange={(e) => setEvidenceFiles(Array.from(e.target.files))}
              className="w-full"
            />
          </div>

          <button
            type="submit"
            className="bg-[#f25c05] hover:bg-[#d14e00] text-white px-4 py-2 rounded font-semibold transition"
          >
            Send to Judge
          </button>
        </form>

        {message && (
          <div className="mt-4 p-3 border rounded text-sm bg-gray-50">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProsecutorToJudgeForm;
