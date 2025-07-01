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
const [selectedJudge, setSelectedJudge] = useState(null);
  const [selectedCourt, setSelectedCourt] = useState('');
  const [details, setDetails] = useState('');
  const [evidenceSummary, setEvidenceSummary] = useState('');
  const [witnesses, setWitnesses] = useState('');
  const [caseFiles, setCaseFiles] = useState([]);
  const [evidenceFiles, setEvidenceFiles] = useState([]);
  const [message, setMessage] = useState('');

  const availableCourts = [
    'Federal High Court - Addis Ababa',
    'Supreme Court - Oromia',
    'Regional Court - Amhara',
    'Municipal Court - Hawassa',
    'First Instance Court - Dire Dawa'
  ];

  useEffect(() => {
    if (passedCase?.id) setCaseId(String(passedCase.id));
    const storedProsecutor = JSON.parse(localStorage.getItem('prosecutor'));
    setProsecutor(storedProsecutor);
    axios.get('http://localhost:8080/api/prosecutor/judges')
      .then(res => setJudges(res.data))
      .catch(err => console.error('Error loading judges:', err));
  }, [passedCase]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('caseId', caseId);
    formData.append('prosecutorId', prosecutor?.id);
    formData.append('judgeId', selectedJudge); // must be number
    formData.append('courtName', selectedCourt);
    formData.append('details', details);
    formData.append('evidenceSummary', evidenceSummary);
    formData.append('witnesses', witnesses);
    caseFiles.forEach(file => formData.append('caseFiles', file));
    evidenceFiles.forEach(file => formData.append('evidenceFiles', file));

    try {
      await axios.post('http://localhost:8080/api/prosecutor/send-to-judge', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage("✅ Sent to judge successfully");
      navigate('/prosecutor/home');
    } catch (err) {
      console.error(err);
      setMessage("❌ Error submitting form: " + (err.response?.data || err.message));
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Formal Case Opening Form</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="font-bold">Case ID</label>
          <input type="text" value={caseId} readOnly className="w-full border p-2 rounded bg-gray-100" />
        </div>

        <div>
          <label className="font-bold">Select Court</label>
          <select value={selectedCourt} onChange={(e) => setSelectedCourt(e.target.value)} required className="w-full border p-2 rounded">
            <option value="">-- Select Court --</option>
            {availableCourts.map((court, index) => (
              <option key={index} value={court}>{court}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-bold">Select Judge</label>
        <select
        value={selectedJudge}
        onChange={(e) => setSelectedJudge(Number(e.target.value))}
        required
        className="w-full border p-2 rounded"
      >
        <option value="">-- Select Judge --</option>
        {judges.map(j => (
          <option key={j.id} value={j.id}>
            {j.name} ({j.username})
          </option>
        ))}
      </select>



        </div>

        <textarea placeholder="Case Details" value={details} onChange={(e) => setDetails(e.target.value)} required className="w-full border p-2 rounded" />
        <textarea placeholder="Evidence Summary" value={evidenceSummary} onChange={(e) => setEvidenceSummary(e.target.value)} required className="w-full border p-2 rounded" />
        <textarea placeholder="Witnesses" value={witnesses} onChange={(e) => setWitnesses(e.target.value)} required className="w-full border p-2 rounded" />

        <input type="file" multiple onChange={e => setCaseFiles(Array.from(e.target.files))} />
        <input type="file" multiple onChange={e => setEvidenceFiles(Array.from(e.target.files))} />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Submit</button>
        {message && <div className="mt-4 text-sm text-red-600">{message}</div>}
      </form>
    </div>
  );
};

export default ProsecutorToJudgeForm;
