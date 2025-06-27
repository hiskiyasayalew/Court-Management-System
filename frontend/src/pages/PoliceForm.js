import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const PoliceForm = () => {
  const location = useLocation();
  const passedCase = location.state?.caseData;

  const [caseId, setCaseId] = useState('');
  const [prosecutors, setProsecutors] = useState([]);
  const [selectedProsecutor, setSelectedProsecutor] = useState('');
  const [details, setDetails] = useState('');
  const [evidence, setEvidence] = useState('');
  const [witnesses, setWitnesses] = useState('');
  const [caseFiles, setCaseFiles] = useState([]);
  const [evidenceFiles, setEvidenceFiles] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (passedCase?.id) {
      setCaseId(passedCase.id);
    }
  }, [passedCase]);

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/prosecutor')
      .then(res => {
        if (Array.isArray(res.data)) {
          setProsecutors(res.data);
        } else {
          console.error("Expected array but got:", res.data);
          setProsecutors([]);
        }
      })
      .catch(err => {
        console.error('Failed to fetch prosecutors:', err);
        setProsecutors([]);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('caseId', caseId);
    formData.append('prosecutorId', selectedProsecutor);
    formData.append('details', details);
    formData.append('evidence', evidence);
    formData.append('witnesses', witnesses);

    for (let file of caseFiles) {
      formData.append('caseFiles', file);
    }

    for (let file of evidenceFiles) {
      formData.append('evidenceFiles', file);
    }

    try {
      const res = await axios.post('http://localhost:8080/api/police/send-to-prosecutor', formData);
      setMessage('✅ Case successfully forwarded to prosecutor.');
      setDetails('');
      setEvidence('');
      setWitnesses('');
      setCaseFiles([]);
      setEvidenceFiles([]);
      setSelectedProsecutor('');
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to send case: ' + (err.response?.data || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center p-6">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">Forward Case to Prosecutor</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold">Case ID:</label>
            <input
              type="text"
              value={caseId}
              onChange={(e) => setCaseId(e.target.value)}
              required
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold">Select Prosecutor:</label>
            <select
              value={selectedProsecutor}
              onChange={(e) => setSelectedProsecutor(e.target.value)}
              required
              className="w-full border p-2 rounded"
            >
              <option value="">-- Select Prosecutor --</option>
              {prosecutors.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
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
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
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

          {/* ✅ Consistent button styling */}
          <button
            type="submit"
            className="bg-[#f25c05] hover:bg-[#d14e00] text-white px-4 py-2 rounded font-semibold transition"
          >
            Send to Prosecutor
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

export default PoliceForm;
