import React, { useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { completeGoogleProfile, clearError } from '../redux/AuthSlice';

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const { googleUserData, isLoading, error } = useSelector((state) => state.auth);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [showModal, setShowModal] = useState(false);
  
  // Pre-fill with Google data
  const profileDataRef = useRef({
    // Pre-filled from Google
    fullName: googleUserData?.name || '',
    email: googleUserData?.email || '',
    profileImage: '😎',
    
    // Need to be filled
    phone: '',
    dob: '',
    
    // Educational Details
    collegeName: '',
    degreeName: '',
    currentSemester: '',
    
    // Profiling Details
    preferredLanguage: '',
    pastProjects: '',
    purpose: '',
    github: '',
    linkedin: ''
  });

  const emojis = ['😎', '🤓', '🚀', '💻', '🎯', '⚡', '🔥', '🌟', '🎮', '🦄'];

  // Handle form changes
  const handleChange = useCallback((e) => {
    profileDataRef.current = {
      ...profileDataRef.current,
      [e.target.name]: e.target.value
    };
  }, []);

  const handleEmojiSelect = useCallback((emoji) => {
    profileDataRef.current = {
      ...profileDataRef.current,
      profileImage: emoji
    };
    // Force re-render only for emoji selection
    setCurrentStep(currentStep);
  }, [currentStep]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // Merge Google data with form data
    const completeData = {
      ...profileDataRef.current,
      // Ensure Google data is preserved
      fullName: googleUserData?.name || profileDataRef.current.fullName,
      email: googleUserData?.email || profileDataRef.current.email,
      googleId: googleUserData?.id,
      profilePicture: googleUserData?.picture
    };
    
    dispatch(completeGoogleProfile(completeData));
  }, [dispatch, googleUserData]);

  const nextStep = useCallback(() => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  }, [currentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  }, [currentStep]);

  const closeModal = useCallback(() => {
    setShowModal(false);
    dispatch(clearError());
  }, [dispatch]);

  // Show error modal when error occurs
  React.useEffect(() => {
    if (error) {
      setShowModal(true);
    }
  }, [error]);

  const ErrorModal = () => (
    showModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center transform animate-bounce">
          <div className="text-6xl mb-4">😬</div>
          <h3 className="text-xl font-bold text-red-500 mb-4">Oops!</h3>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={closeModal}
            className="bg-red-500 text-white px-6 py-3 rounded-2xl font-bold hover:bg-red-600 transition-all duration-300 hover:scale-105"
          >
            Got it! 👍
          </button>
        </div>
      </div>
    )
  );

  const PersonalDetailsStep = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-center text-purple-600 mb-6">Complete Your Profile 👤</h3>
      
      {/* Google Profile Preview */}
      <div className="bg-green-50 p-4 rounded-2xl mb-6">
        <div className="flex items-center space-x-3">
          {googleUserData?.picture ? (
            <img 
              src={googleUserData.picture} 
              alt="Profile" 
              className="w-12 h-12 rounded-full"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
              {googleUserData?.name?.charAt(0) || 'G'}
            </div>
          )}
          <div>
            <p className="font-bold text-green-700">Welcome, {googleUserData?.name}! 👋</p>
            <p className="text-sm text-green-600">{googleUserData?.email}</p>
          </div>
        </div>
      </div>

      {/* Emoji Selection */}
      <div className="flex justify-center mb-6">
        <div className="flex flex-wrap gap-2">
          {emojis.map(emoji => (
            <button
              key={emoji}
              type="button"
              onClick={() => handleEmojiSelect(emoji)}
              className={`text-3xl p-2 rounded-2xl transition-all duration-300 hover:scale-110 ${
                profileDataRef.current.profileImage === emoji ? 'bg-purple-200 scale-110' : 'hover:bg-gray-100'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      <input
        type="tel"
        name="phone"
        placeholder="Phone Number 📱"
        defaultValue={profileDataRef.current.phone}
        onChange={handleChange}
        className="w-full p-4 border-3 border-purple-200 rounded-2xl text-lg font-medium focus:border-purple-500 focus:outline-none transition-all duration-300 focus:scale-105"
        required
      />
      
      <input
        type="date"
        name="dob"
        defaultValue={profileDataRef.current.dob}
        onChange={handleChange}
        className="w-full p-4 border-3 border-purple-200 rounded-2xl text-lg font-medium focus:border-purple-500 focus:outline-none transition-all duration-300 focus:scale-105"
        required
      />
    </div>
  );

  const EducationStep = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-center text-blue-600 mb-6">Education Details 🎓</h3>
      
      <input
        type="text"
        name="collegeName"
        placeholder="College/University Name 🏫"
        defaultValue={profileDataRef.current.collegeName}
        onChange={handleChange}
        className="w-full p-4 border-3 border-blue-200 rounded-2xl text-lg font-medium focus:border-blue-500 focus:outline-none transition-all duration-300 focus:scale-105"
      />
      
      <input
        type="text"
        name="degreeName"
        placeholder="Degree Name 📜"
        defaultValue={profileDataRef.current.degreeName}
        onChange={handleChange}
        className="w-full p-4 border-3 border-blue-200 rounded-2xl text-lg font-medium focus:border-blue-500 focus:outline-none transition-all duration-300 focus:scale-105"
      />
      
      <input
        type="number"
        name="currentSemester"
        placeholder="Current Semester 📚"
        defaultValue={profileDataRef.current.currentSemester}
        onChange={handleChange}
        className="w-full p-4 border-3 border-blue-200 rounded-2xl text-lg font-medium focus:border-blue-500 focus:outline-none transition-all duration-300 focus:scale-105"
        min="1"
        max="12"
      />
    </div>
  );

  const ProfilingStep = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-center text-green-600 mb-6">Tell Us About You! 🚀</h3>
      
      <select
        name="preferredLanguage"
        defaultValue={profileDataRef.current.preferredLanguage}
        onChange={handleChange}
        className="w-full p-4 border-3 border-green-200 rounded-2xl text-lg font-medium focus:border-green-500 focus:outline-none transition-all duration-300 focus:scale-105"
      >
        <option value="">Preferred Programming Language 💻</option>
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="java">Java</option>
        <option value="cpp">C++</option>
        <option value="react">React</option>
        <option value="nodejs">Node.js</option>
        <option value="other">Other</option>
      </select>
      
      <textarea
        name="pastProjects"
        placeholder="Past Projects (comma separated) 🛠️"
        defaultValue={profileDataRef.current.pastProjects}
        onChange={handleChange}
        className="w-full p-4 border-3 border-green-200 rounded-2xl text-lg font-medium focus:border-green-500 focus:outline-none transition-all duration-300 focus:scale-105 h-24 resize-none"
      />
      
      <select
        name="purpose"
        defaultValue={profileDataRef.current.purpose}
        onChange={handleChange}
        className="w-full p-4 border-3 border-green-200 rounded-2xl text-lg font-medium focus:border-green-500 focus:outline-none transition-all duration-300 focus:scale-105"
        required
      >
        <option value="">What brings you here? 🎯</option>
        <option value="contributor">I want to contribute to projects 🤝</option>
        <option value="mock-interview">I need mock interviews 🎤</option>
        <option value="opensource-consumer">I want to use open source projects 📦</option>
        <option value="other">Other 🌟</option>
      </select>
      
      <input
        type="url"
        name="github"
        placeholder="GitHub Profile (optional) 🐱"
        defaultValue={profileDataRef.current.github}
        onChange={handleChange}
        className="w-full p-4 border-3 border-green-200 rounded-2xl text-lg font-medium focus:border-green-500 focus:outline-none transition-all duration-300 focus:scale-105"
      />
      
      <input
        type="url"
        name="linkedin"
        placeholder="LinkedIn Profile (optional) 💼"
        defaultValue={profileDataRef.current.linkedin}
        onChange={handleChange}
        className="w-full p-4 border-3 border-green-200 rounded-2xl text-lg font-medium focus:border-green-500 focus:outline-none transition-all duration-300 focus:scale-105"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative overflow-hidden">
        {/* Fun decorative elements */}
        <div className="absolute -top-4 -right-4 text-6xl opacity-20 animate-spin">🎯</div>
        <div className="absolute -bottom-4 -left-4 text-6xl opacity-20 animate-bounce">🚀</div>
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-purple-600 mb-2">
            Almost Done! 🎉
          </h1>
          <p className="text-gray-600 font-medium">
            Complete your profile to join CodeBuddy
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step Progress */}
          <div className="flex justify-center mb-6">
            <div className="flex space-x-2">
              {[1, 2, 3].map(step => (
                <div
                  key={step}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    step <= currentStep ? 'bg-purple-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {currentStep === 1 && <PersonalDetailsStep />}
          {currentStep === 2 && <EducationStep />}
          {currentStep === 3 && <ProfilingStep />}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {currentStep > 1 && (
              <button 
                type="button"
                onClick={prevStep}
                className="px-6 py-3 bg-gray-300 text-gray-700 rounded-2xl font-bold hover:bg-gray-400 transition-all duration-300 hover:scale-105"
              >
                ← Back
              </button>
            )}
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="ml-auto px-6 py-3 bg-purple-500 text-white rounded-2xl font-bold hover:bg-purple-600 transition-all duration-300 hover:scale-105"
              >
                Next →
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className={`ml-auto px-6 py-3 bg-green-500 text-white rounded-2xl font-bold hover:bg-green-600 transition-all duration-300 hover:scale-105 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Completing Profile... ⏳' : 'Complete Profile! 🎉'}
              </button>
            )}
          </div>
        </form>
      </div>
      <ErrorModal />
    </div>
  );
};

export default UpdateProfile;