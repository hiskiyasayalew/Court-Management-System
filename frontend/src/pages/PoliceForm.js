import React, { useState } from 'react';

const PoliceForm = () => {
  const [details, setDetails] = useState('');
  const [evidence, setEvidence] = useState('');
  const [witnesses, setWitnesses] = useState('');
  const [caseFiles, setCaseFiles] = useState([]);
  const [evidenceFiles, setEvidenceFiles] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleCaseFileChange = (e) => {
    setCaseFiles(e.target.files);
  };

  const handleEvidenceFileChange = (e) => {
    setEvidenceFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic validation
    if (!details || !evidence || !witnesses || caseFiles.length === 0) {
      setError('All fields are required, including at least one case file.');
      return;
    }

    const formData = new FormData();
    formData.append('details', details);
    formData.append('evidence', evidence);
    formData.append('witnesses', witnesses);

    // Append case files to FormData
    for (let i = 0; i < caseFiles.length; i++) {
      formData.append('caseFiles', caseFiles[i]);
    }

    // Append evidence files to FormData if any
    for (let i = 0; i < evidenceFiles.length; i++) {
      formData.append('evidenceFiles', evidenceFiles[i]);
    }

    try {
      const response = await fetch('http://localhost:8080/api/police/send-to-prosecutor', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setSuccess('Case sent to prosecutor successfully.');
        setDetails('');
        setEvidence('');
        setWitnesses('');
        setCaseFiles([]);
        setEvidenceFiles([]);
      } else {
        setError('Failed to send case. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-6">Send Case to Prosecutor</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
        
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Incident Details</label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="w-full h-24 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Evidence Description</label>
          <textarea
            value={evidence}
            onChange={(e) => setEvidence(e.target.value)}
            className="w-full h-24 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Witnesses</label>
          <textarea
            value={witnesses}
            onChange={(e) => setWitnesses(e.target.value)}
            className="w-full h-24 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Upload Case Files (Mandatory)</label>
          <input
            type="file"
            multiple
            onChange={handleCaseFileChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Upload Evidence Files (Optional)</label>
          <input
            type="file"
            multiple
            onChange={handleEvidenceFileChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
        >
          Send to Prosecutor
        </button>
      </form>
    </div>
  );
};

export default PoliceForm;