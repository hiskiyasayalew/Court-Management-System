import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const JudgeHomePage = () => {
  const navigate = useNavigate();

  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [showApprovalForm, setShowApprovalForm] = useState(false);
  const [showVerdictForm, setShowVerdictForm] = useState(false);
  const [verdictText, setVerdictText] = useState('');

  const [approvalData, setApprovalData] = useState({
    hearingDate: '',
    assignedJudges: [],
    assignedCourt: '',
  });

  const judge = JSON.parse(localStorage.getItem('judge'));
  const judgeName = judge ? judge.name : 'Judge';

  const dummyJudges = [
    'Judge John Doe',
    'Judge Jane Smith',
    'Judge Alex Brown',
    'Judge Emily White',
    'Judge Michael Green',
    'Judge Sarah Johnson',
    'Judge David Wilson',
    'Judge Linda Martinez',
    'Judge Robert Taylor',
    'Judge Patricia Anderson',
  ];

  const dummyCourts = ['High Court A', 'District Court B', 'Magistrate Court C'];

  useEffect(() => {
    if (!judge) return;

    axios
      .get(`http://localhost:8080/api/judge/cases?judgeId=${judge.id}`)
      .then((res) => setCases(res.data))
      .catch((err) => console.error('Failed to fetch cases', err));
  }, [judge]);

  const handleOpenApprovalForm = () => {
    setShowApprovalForm(true);
  };

  const handleCloseApprovalForm = () => {
    setShowApprovalForm(false);
    setApprovalData({
      hearingDate: '',
      assignedJudges: [],
      assignedCourt: '',
    });
  };

  const handleApprovalChange = (e) => {
    const { name, value } = e.target;
    setApprovalData((prev) => ({ ...prev, [name]: value }));
  };

  const handleJudgeCheckboxChange = (judgeName) => {
    setApprovalData((prev) => {
      const alreadySelected = prev.assignedJudges.includes(judgeName);
      if (alreadySelected) {
        return {
          ...prev,
          assignedJudges: prev.assignedJudges.filter((j) => j !== judgeName),
        };
      } else {
        return {
          ...prev,
          assignedJudges: [...prev.assignedJudges, judgeName],
        };
      }
    });
  };

  const handleSubmitApproval = async () => {
    if (
      !approvalData.hearingDate ||
      !approvalData.assignedCourt ||
      approvalData.assignedJudges.length === 0
    ) {
      alert('Please fill out all fields.');
      return;
    }

    const payload = {
      caseId: selectedCase.caseId,
      hearingDate: approvalData.hearingDate,
      assignedJudges: approvalData.assignedJudges,
      assignedCourt: approvalData.assignedCourt,
    };

    try {
      await axios.post('http://localhost:8080/api/judge/approve', payload);
      alert('✅ Case approved and scheduled successfully!');
      setCases((prev) => prev.filter((c) => c.caseId !== selectedCase.caseId));
      setSelectedCase(null);
      handleCloseApprovalForm();
    } catch (err) {
      console.error('Approval failed:', err);
      alert('❌ Failed to approve the case.');
    }
  };

  const handleReject = async () => {
    try {
      await axios.post('http://localhost:8080/api/judge/reject', { caseId: selectedCase.caseId });
      alert(`❌ Case ${selectedCase.caseId} rejected.`);
      setCases((prev) => prev.filter((c) => c.caseId !== selectedCase.caseId));
      setSelectedCase(null);
    } catch (err) {
      console.error('Rejection failed:', err);
      alert('❌ Failed to reject the case.');
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-2 animate-fade-in">
        Welcome, {judgeName}!
      </h1>

      <button
        onClick={() => navigate('/judge/verdicts')}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
      >
        📜 Go to Verdict Page
      </button>

      <p className="text-gray-700 mb-8 text-lg">
        Here are your assigned cases for review.
      </p>

      {!selectedCase ? (
        <ul className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          {cases.map((c) => (
            <li
              key={c.caseId || c.id}
              onClick={() => setSelectedCase(c)}
              className="cursor-pointer p-6 border rounded-xl shadow hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 ease-in-out bg-white"
            >
              <p className="text-lg font-semibold mb-2">
                📁 Case ID: {c.caseId}
              </p>
              <p className="text-gray-600">
                {c.details
                  ? c.details.length > 100
                    ? `${c.details.substring(0, 100)}...`
                    : c.details
                  : 'No details provided'}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <div className="border rounded-xl shadow-lg p-8 bg-white animate-fade-in">
          <button
            onClick={() => setSelectedCase(null)}
            className="mb-6 inline-block bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded transition"
          >
            ⬅️ Back to Cases
          </button>

          <h2 className="text-2xl font-bold mb-4">Case Details</h2>
          <div className="space-y-2">
            <p>
              <strong>Case ID:</strong> {selectedCase.caseId}
            </p>
            <p>
              <strong>Details:</strong> {selectedCase.details || 'N/A'}
            </p>
            <p>
              <strong>Evidence Summary:</strong>{' '}
              {selectedCase.evidenceSummary || 'N/A'}
            </p>
            <p>
              <strong>Witnesses:</strong> {selectedCase.witnesses || 'N/A'}
            </p>
          </div>

          <h3 className="mt-6 font-semibold text-lg">Case Files:</h3>
          <ul className="list-disc ml-5">
            {selectedCase.caseFileNames?.length > 0 ? (
              selectedCase.caseFileNames.map((file, i) => (
                <li key={i}>
                  <a
                    href={`http://localhost:8080/uploads/${file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    {file}
                  </a>
                </li>
              ))
            ) : (
              <li>No case files</li>
            )}
          </ul>

          <h3 className="mt-4 font-semibold text-lg">Evidence Files:</h3>
          <ul className="list-disc ml-5">
            {selectedCase.evidenceFileNames?.length > 0 ? (
              selectedCase.evidenceFileNames.map((file, i) => (
                <li key={i}>
                  <a
                    href={`http://localhost:8080/uploads/${file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    {file}
                  </a>
                </li>
              ))
            ) : (
              <li>No evidence files</li>
            )}
          </ul>

          <div className="flex gap-4 mt-8">
            <button
              onClick={handleOpenApprovalForm}
              className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              ✅ Approve
            </button>
            <button
              onClick={handleReject}
              className="px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              ❌ Reject
            </button>
            <button
              onClick={() => setShowVerdictForm(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              📜 Submit Verdict
            </button>
          </div>
        </div>
      )}

      {showApprovalForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl max-w-md w-full shadow-lg">
            <h3 className="text-xl font-bold mb-4">Schedule & Approve Case</h3>

            <label className="block mb-2 font-medium">
              Hearing Date & Time
            </label>
            <input
              type="datetime-local"
              name="hearingDate"
              value={approvalData.hearingDate}
              onChange={handleApprovalChange}
              className="w-full border rounded px-3 py-2 mb-4"
            />

            <label className="block mb-2 font-medium">Assign Judges</label>
            <div className="mb-4 max-h-40 overflow-y-auto border rounded p-2">
              {dummyJudges.map((j, i) => (
                <label key={i} className="flex items-center mb-1">
                  <input
                    type="checkbox"
                    checked={approvalData.assignedJudges.includes(j)}
                    onChange={() => handleJudgeCheckboxChange(j)}
                    className="mr-2"
                  />
                  {j}
                </label>
              ))}
            </div>

            <label className="block mb-2 font-medium">Assign Court</label>
            <select
              name="assignedCourt"
              value={approvalData.assignedCourt}
              onChange={handleApprovalChange}
              className="w-full border rounded px-3 py-2 mb-6"
            >
              <option value="">-- Select Court --</option>
              {dummyCourts.map((c, i) => (
                <option key={i} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <div className="flex justify-between">
              <button
                onClick={handleSubmitApproval}
                className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
              >
                Submit
              </button>
              <button
                onClick={handleCloseApprovalForm}
                className="bg-gray-300 text-gray-700 px-5 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showVerdictForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full shadow-lg">
            <h3 className="text-xl font-bold mb-4">
              Submit Verdict for Case {selectedCase.caseId}
            </h3>
            <textarea
              rows="6"
              value={verdictText}
              onChange={(e) => setVerdictText(e.target.value)}
              placeholder="Enter verdict details here..."
              className="w-full border rounded p-3 mb-4"
            />
            <div className="flex justify-between">
              <button
                onClick={async () => {
                  if (!verdictText.trim()) {
                    alert('Verdict text cannot be empty.');
                    return;
                  }
                  try {
                    await axios.post('http://localhost:8080/api/judge/verdict', {
                      caseId: selectedCase.caseId,
                      verdictText: verdictText.trim(),
                    });
                    alert('Verdict submitted successfully!');
                    setShowVerdictForm(false);
                    setVerdictText('');
                  } catch (err) {
                    console.error('Failed to submit verdict:', err);
                    alert('Failed to submit verdict.');
                  }
                }}
                className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
              >
                Submit
              </button>
              <button
                onClick={() => {
                  setShowVerdictForm(false);
                  setVerdictText('');
                }}
                className="bg-gray-300 text-gray-700 px-5 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JudgeHomePage;
