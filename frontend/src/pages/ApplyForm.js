import React, { useState } from 'react';

const ApplyForm = ({ onSubmit }) => {
  const [role, setRole] = useState('');
  const [reason, setReason] = useState('');
  const [education, setEducation] = useState('');
  const [workExperience, setWorkExperience] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [educationFiles, setEducationFiles] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!role) newErrors.role = 'Please select a role.';
    if (!fullName.trim()) newErrors.fullName = 'Please enter your full name.';
    if (!email.trim()) newErrors.email = 'Please enter your email address.';
    if (!phone.trim()) newErrors.phone = 'Please enter your phone number.';
    if (!address.trim()) newErrors.address = 'Please enter your address.';
    if (!reason.trim()) newErrors.reason = 'Please provide a reason for applying.';
    if (!education.trim()) newErrors.education = 'Please provide your educational background.';
    if (!workExperience.trim()) newErrors.workExperience = 'Please provide your work experience.';
    if (!educationFiles || educationFiles.length === 0) newErrors.educationFiles = 'Please upload your educational degrees or certificates.';
    return newErrors;
  };

  const handleFileChange = (e) => {
    setEducationFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const application = {
      role,
      reason,
      education,
      workExperience,
      additionalInfo,
      fullName,
      email,
      phone,
      address,
    };

    const formData = new FormData();
    formData.append('application', new Blob([JSON.stringify(application)], { type: 'application/json' }));

    (educationFiles || []).forEach((file) => {
      formData.append('files', file);
    });

    try {
      const response = await fetch('http://localhost:8080/api/admin/applications', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        alert(`Server error: ${JSON.stringify(errorData)}`);
      } else {
        alert('Application submitted successfully');
        setSubmitted(true);
        setErrors({});
      }
    } catch (error) {
      console.error('Network error:', error);
      alert(`Network error: ${error.message}`);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center p-4 sm:p-6">
        <main className="max-w-md w-full text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3 sm:mb-4">Application Submitted</h1>
          <p className="text-base sm:text-lg text-gray-700">
            Submitted successfully. Your application will be reviewed by the admin.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-6 sm:mt-8 bg-[#f25c05] text-white py-2 px-6 rounded-md hover:bg-[#d14e00] transition text-sm sm:text-base"
            type="button"
          >
            Submit another application
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen flex items-center justify-center p-4 sm:p-6">
      <main className="max-w-md sm:max-w-lg w-full">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6 sm:mb-8 text-center">
          Application Form
        </h1>
        <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="fullName" className="block font-medium text-gray-700 mb-1 text-sm sm:text-base">
              Full Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className={`w-full border rounded-md px-3 py-2 text-sm sm:text-base ${
                errors.fullName ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-[#f25c05]`}
              required
            />
            {errors.fullName && <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.fullName}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block font-medium text-gray-700 mb-1 text-sm sm:text-base">
              Email <span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className={`w-full border rounded-md px-3 py-2 text-sm sm:text-base ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-[#f25c05]`}
              required
            />
            {errors.email && <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="block font-medium text-gray-700 mb-1 text-sm sm:text-base">
              Phone Number <span className="text-red-600">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              className={`w-full border rounded-md px-3 py-2 text-sm sm:text-base ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-[#f25c05]`}
              required
            />
            {errors.phone && <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label htmlFor="address" className="block font-medium text-gray-700 mb-1 text-sm sm:text-base">
              Address <span className="text-red-600">*</span>
            </label>
            <textarea
              id="address"
              name="address"
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your address"
              className={`w-full border rounded-md px-3 py-2 resize-y text-sm sm:text-base ${
                errors.address ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-[#f25c05]`}
              required
            />
            {errors.address && <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.address}</p>}
          </div>

          <div>
            <label htmlFor="role" className="block font-medium text-gray-700 mb-1 text-sm sm:text-base">
              Select Role <span className="text-red-600">*</span>
            </label>
            <select
              id="role"
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={`w-full border rounded-md px-3 py-2 text-sm sm:text-base ${
                errors.role ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-[#f25c05]`}
              required
            >
              <option value="">-- Select Role --</option>
              <option value="judge">Judge</option>
              <option value="police">Police</option>
              <option value="prosecutor">Prosecutor</option>
            </select>
            {errors.role && <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.role}</p>}
          </div>

          <div>
            <label htmlFor="reason" className="block font-medium text-gray-700 mb-1 text-sm sm:text-base">
              Why do you want to apply? <span className="text-red-600">*</span>
            </label>
            <textarea
              id="reason"
              name="reason"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain your motivation"
              className={`w-full border rounded-md px-3 py-2 resize-y text-sm sm:text-base ${
                errors.reason ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-[#f25c05]`}
              required
            />
            {errors.reason && <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.reason}</p>}
          </div>

          <div>
            <label htmlFor="education" className="block font-medium text-gray-700 mb-1 text-sm sm:text-base">
              Educational Background <span className="text-red-600">*</span>
            </label>
            <textarea
              id="education"
              name="education"
              rows={3}
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              placeholder="List your degrees, certifications, institutions, etc."
              className={`w-full border rounded-md px-3 py-2 resize-y text-sm sm:text-base ${
                errors.education ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-[#f25c05]`}
              required
            />
            {errors.education && <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.education}</p>}
          </div>

          <div>
            <label htmlFor="educationFiles" className="block font-medium text-gray-700 mb-1 text-sm sm:text-base">
              Upload Educational Degrees / Certificates <span className="text-red-600">*</span>
            </label>
            <input
              type="file"
              id="educationFiles"
              name="educationFiles"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              multiple
              className={`w-full border rounded-md px-3 py-2 text-xs sm:text-sm ${
                errors.educationFiles ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-[#f25c05]`}
              required
            />
            {errors.educationFiles && (
              <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.educationFiles}</p>
            )}
          </div>

          <div>
            <label htmlFor="workExperience" className="block font-medium text-gray-700 mb-1 text-sm sm:text-base">
              Work Experience <span className="text-red-600">*</span>
            </label>
            <textarea
              id="workExperience"
              name="workExperience"
              rows={3}
              value={workExperience}
              onChange={(e) => setWorkExperience(e.target.value)}
              placeholder="Describe your relevant work history"
              className={`w-full border rounded-md px-3 py-2 resize-y text-sm sm:text-base ${
                errors.workExperience ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-[#f25c05]`}
              required
            />
            {errors.workExperience && <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.workExperience}</p>}
          </div>

          <div>
            <label htmlFor="additionalInfo" className="block font-medium text-gray-700 mb-1 text-sm sm:text-base">
              Additional Information (optional)
            </label>
            <textarea
              id="additionalInfo"
              name="additionalInfo"
              rows={3}
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="Any other details you want to provide"
              className="w-full border border-gray-300 rounded-md px-3 py-2 resize-y text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#f25c05]"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-[#f25c05] text-white py-2 rounded-md text-base sm:text-lg font-semibold hover:bg-[#d14e00] transition"
            >
              Submit Application
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ApplyForm;
