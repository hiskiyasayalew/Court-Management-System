import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const AppealForm = () => {
  const { caseId } = useParams();
  const [reason, setReason] = useState('');
  const [caseData, setCaseData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCase = async () => {
      const res = await fetch(`http://localhost:8080/api/cases/${caseId}`);
      const data = await res.json();
      setCaseData(data);
    };
    fetchCase();
  }, [caseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    const appeal = {
      caseId: parseInt(caseId),
      userName: user.userName,
      reason
    };

    const response = await fetch("http://localhost:8080/api/appeals/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(appeal)
    });

    if (response.ok) {
      alert("Appeal submitted successfully!");
      navigate('/AppealPage');
    } else {
      alert("Failed to submit appeal.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-6 rounded-xl shadow max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4">Submit Appeal</h2>
        {caseData && (
          <div className="mb-4 text-sm text-gray-700">
            <p><strong>Case:</strong> {caseData.fullName}</p>
            <p><strong>Type:</strong> {caseData.caseType}</p>
            <p><strong>Status:</strong> {caseData.status}</p>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full border p-2 rounded mb-4"
            placeholder="Explain your reason for the appeal..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={5}
            required
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Submit Appeal</button>
        </form>
      </div>
    </div>
  );
};

export default AppealForm;
