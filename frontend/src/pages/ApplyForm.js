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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      
      // Scroll to first error
      const firstErrorField = Object.keys(newErrors)[0];
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      return;
    }

    setIsSubmitting(true);
    
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
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
        <main className="max-w-md w-full bg-white p-6 sm:p-8 rounded-xl shadow-sm text-center">
          <div className="mb-5">
            <svg className="w-16 h-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">Application Submitted</h1>
          <p className="text-gray-600 mb-6">
            Your application has been submitted successfully. It will be reviewed by our administration team.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              // Reset form
              setRole('');
              setReason('');
              setEducation('');
              setWorkExperience('');
              setAdditionalInfo('');
              setEducationFiles(null);
              setFullName('');
              setEmail('');
              setPhone('');
              setAddress('');
            }}
            className="bg-blue-600 text-white py-2.5 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            type="button"
          >
            Submit Another Application
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-3 sm:py-8 sm:px-4">
      <main className="max-w-2xl mx-auto bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Application Form</h1>
          <p className="text-gray-600 text-sm sm:text-base">Apply for a position in the judicial system</p>
        </div>
        
        <div className="mb-5 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h2 className="text-blue-800 font-medium mb-2 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Required Fields
          </h2>
          <p className="text-blue-700 text-xs sm:text-sm">Fields marked with <span className="text-red-600">*</span> are required</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="fullName" className="block font-medium text-gray-700 mb-1.5 text-sm sm:text-base">
                Full Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className={`w-full border rounded-lg px-3 py-2.5 text-sm sm:text-base ${
                  errors.fullName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
              {errors.fullName && <p className="text-red-600 text-xs mt-1.5">{errors.fullName}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block font-medium text-gray-700 mb-1.5 text-sm sm:text-base">
                Email <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className={`w-full border rounded-lg px-3 py-2.5 text-sm sm:text-base ${
                  errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
              {errors.email && <p className="text-red-600 text-xs mt-1.5">{errors.email}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="phone" className="block font-medium text-gray-700 mb-1.5 text-sm sm:text-base">
                Phone Number <span className="text-red-600">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                className={`w-full border rounded-lg px-3 py-2.5 text-sm sm:text-base ${
                  errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
              {errors.phone && <p className="text-red-600 text-xs mt-1.5">{errors.phone}</p>}
            </div>

            <div>
              <label htmlFor="role" className="block font-medium text-gray-700 mb-1.5 text-sm sm:text-base">
                Select Role <span className="text-red-600">*</span>
              </label>
              <select
                id="role"
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className={`w-full border rounded-lg px-3 py-2.5 text-sm sm:text-base ${
                  errors.role ? 'border-red-500 bg-red-50' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              >
                <option value="">-- Select Role --</option>
                <option value="judge">Judge</option>
                <option value="police">Police</option>
                <option value="prosecutor">Prosecutor</option>
              </select>
              {errors.role && <p className="text-red-600 text-xs mt-1.5">{errors.role}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="address" className="block font-medium text-gray-700 mb-1.5 text-sm sm:text-base">
              Address <span className="text-red-600">*</span>
            </label>
            <textarea
              id="address"
              name="address"
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your complete address"
              className={`w-full border rounded-lg px-3 py-2.5 resize-y text-sm sm:text-base ${
                errors.address ? 'border-red-500 bg-red-50' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
            {errors.address && <p className="text-red-600 text-xs mt-1.5">{errors.address}</p>}
          </div>

          <div>
            <label htmlFor="reason" className="block font-medium text-gray-700 mb-1.5 text-sm sm:text-base">
              Why do you want to apply? <span className="text-red-600">*</span>
            </label>
            <textarea
              id="reason"
              name="reason"
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain your motivation for applying to this position"
              className={`w-full border rounded-lg px-3 py-2.5 resize-y text-sm sm:text-base ${
                errors.reason ? 'border-red-500 bg-red-50' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
            {errors.reason && <p className="text-red-600 text-xs mt-1.5">{errors.reason}</p>}
          </div>

          <div>
            <label htmlFor="education" className="block font-medium text-gray-700 mb-1.5 text-sm sm:text-base">
              Educational Background <span className="text-red-600">*</span>
            </label>
            <textarea
              id="education"
              name="education"
              rows={4}
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              placeholder="List your degrees, certifications, institutions, and years attended"
              className={`w-full border rounded-lg px-3 py-2.5 resize-y text-sm sm:text-base ${
                errors.education ? 'border-red-500 bg-red-50' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
            {errors.education && <p className="text-red-600 text-xs mt-1.5">{errors.education}</p>}
          </div>

          <div>
            <label htmlFor="educationFiles" className="block font-medium text-gray-700 mb-1.5 text-sm sm:text-base">
              Upload Educational Documents <span className="text-red-600">*</span>
            </label>
            <div className={`border-2 border-dashed rounded-lg p-4 ${
              errors.educationFiles ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}>
              <input
                type="file"
                id="educationFiles"
                name="educationFiles"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                multiple
                className="w-full text-xs sm:text-sm"
              />
              <p className="text-xs text-gray-500 mt-2">Accepted formats: PDF, DOC, DOCX, JPG, JPEG, PNG</p>
            </div>
            {errors.educationFiles && (
              <p className="text-red-600 text-xs mt-1.5">{errors.educationFiles}</p>
            )}
            {educationFiles && educationFiles.length > 0 && (
              <p className="text-green-600 text-xs mt-1.5">
                {educationFiles.length} file(s) selected
              </p>
            )}
          </div>

          <div>
            <label htmlFor="workExperience" className="block font-medium text-gray-700 mb-1.5 text-sm sm:text-base">
              Work Experience <span className="text-red-600">*</span>
            </label>
            <textarea
              id="workExperience"
              name="workExperience"
              rows={4}
              value={workExperience}
              onChange={(e) => setWorkExperience(e.target.value)}
              placeholder="Describe your relevant work history, including positions, responsibilities, and duration"
              className={`w-full border rounded-lg px-3 py-2.5 resize-y text-sm sm:text-base ${
                errors.workExperience ? 'border-red-500 bg-red-50' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
            {errors.workExperience && <p className="text-red-600 text-xs mt-1.5">{errors.workExperience}</p>}
          </div>

          <div>
            <label htmlFor="additionalInfo" className="block font-medium text-gray-700 mb-1.5 text-sm sm:text-base">
              Additional Information (optional)
            </label>
            <textarea
              id="additionalInfo"
              name="additionalInfo"
              rows={3}
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="Any other information you would like to include with your application"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 resize-y text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 rounded-lg text-base font-medium hover:bg-blue-700 disabled:opacity-70 transition-colors flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ApplyForm;