import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  loginUser,
  clearError,
  verifyOTP,
  resendOTP,
} from "../redux/AuthSlice";
import { Dropdown, Input, MultiSelect } from "../components/ui/UI_Components";
import axios from "axios";
import { AUTH } from "../utils/API";

// Constants
const EMOJIS = ["😎", "🤓", "🚀", "💻", "🎯", "⚡", "🔥", "🌟", "🎮", "🦄"];
const OTP_EXPIRY_TIME = 300; // 5 minutes in seconds

// Common Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center animate-fade-in">
        <h3 className="text-xl font-bold mb-4">{title}</h3>
        {children}
        <button
          onClick={onClose}
          className="mt-4 bg-purple-500 text-white px-6 py-3 rounded-2xl font-bold hover:bg-purple-600 transition-all duration-300 hover:scale-105"
        >
          Close
        </button>
      </div>
    </div>
  );
};

// --- STEP COMPONENTS OUTSIDE --- //

const PersonalDetailsStep = ({
  fullName,
  setFullName,
  email,
  setEmail,
  phone,
  setPhone,
  dob,
  setDOB,
  password,
  setPassword,
  selectedEmoji,
  handleEmojiSelect,
  EMOJIS,
  formatDateForInput,
}) => (
  <div className="space-y-4">
    <h3 className="text-xl font-bold text-center text-purple-600 mb-6">
      Personal Details 👤
    </h3>
    <div className="flex justify-center mb-6">
      <div className="flex flex-wrap gap-2">
        {EMOJIS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => handleEmojiSelect(emoji)}
            className={`text-3xl p-2 rounded-2xl transition-all duration-300 hover:scale-110 ${
              selectedEmoji === emoji
                ? "bg-purple-200 scale-110"
                : "hover:bg-gray-100"
            }`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>

    <input
      className="input"
      placeholder="Full Name 📝"
      value={fullName}
      onChange={(e) => setFullName(e.target.value)}
    />
    <input
      className="input"
      placeholder="Email Address 📧"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      type="email"
    />
    <input
      className="input"
      placeholder="Phone Number 📱"
      value={phone}
      onChange={(e) => setPhone(e.target.value)}
    />
    <input
      className="input"
      type="date"
      placeholder="Date of Birth"
      value={formatDateForInput(dob)}
      onChange={(e) => setDOB(e.target.value)}
    />
    <input
      className="input"
      placeholder="Create Password 🔒"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      type="password"
    />
  </div>
);

const EducationStep = ({
  collegeName,
  setcollegeName,
  degreeName,
  setdegreeName,
  currentSemester,
  setcurrentSemester,
}) => (
  <div className="space-y-4">
    <h3 className="text-xl font-bold text-center text-blue-600 mb-6">
      Education Details 🎓
    </h3>

    <input
      className="input"
      placeholder="College/University Name 🏫"
      value={collegeName}
      onChange={(e) => setcollegeName(e.target.value)}
    />

    <Dropdown
      options={[
        { value: "BTech", label: "BTech" },
        { value: "BCA", label: "BCA" },
        { value: "MTech", label: "MTech" },
        { value: "MCA", label: "MCA" },
        { value: "Other", label: "Other" },
      ]}
      value={degreeName}
      onChange={(item) => setdegreeName(item.target.value)}
      label="Degree Name 📜"
    />

    <input
      className="input"
      type="number"
      placeholder="Current Semester 📚"
      min="1"
      max="8"
      value={currentSemester}
      onChange={(e) => setcurrentSemester(e.target.value)}
    />
  </div>
);

const ProfilingStep = ({
  preferredLanguage,
  setpreferredLanguage,
  pastProjects,
  setpastProjects,
  purpose,
  setpurpose,
  github,
  setgithub,
  linkedin,
  setlinkedin,
  purposeData,
}) => (
  <div className="space-y-4">
    <h3 className="text-xl font-bold text-center text-green-600 mb-6">
      Tell Us About You! 🚀
    </h3>

    <MultiSelect
      label="Preferred Programming Language 💻"
      options={[
        { value: "JavaScript", label: "JavaScript" },
        { value: "Python", label: "Python" },
        { value: "Java", label: "Java" },
        { value: "C++", label: "C++" },
        { value: "React", label: "React" },
        { value: "Node.js", label: "Node.js" },
        { value: "Other", label: "Other" },
      ]}
      selectedValues={preferredLanguage}
      onChange={setpreferredLanguage}
    />

    <input
      className="input"
      type="text"
      placeholder="Past Projects (comma separated) 🛠️"
      value={pastProjects}
      onChange={(e) => setpastProjects(e.target.value)}
    />

    <Dropdown
      options={purposeData}
      value={purpose}
      onChange={(item) => setpurpose(item.target.value)}
      label="What brings you here? 🎯"
    />

    <input
      className="input"
      type="text"
      placeholder="GitHub Profile (Optional)"
      value={github}
      onChange={(e) => setgithub(e.target.value)}
    />

    <input
      className="input"
      type="text"
      placeholder="LinkedIn Profile (Optional)"
      value={linkedin}
      onChange={(e) => setlinkedin(e.target.value)}
    />
  </div>
);

const AuthPage = () => {
  // Hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated, otpSent, otpVerified } =
    useSelector((state) => state.auth);

  // State
  const [isLogin, setIsLogin] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", message: "" });
  const [currentStep, setCurrentStep] = useState(1);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpTimer, setOtpTimer] = useState(0);
  const [selectedEmoji, setSelectedEmoji] = useState("😎");

  const purposeData = [
    {
      label: "I want to contribute to projects 🤝",
      value: "contributor",
    },
    { label: "I need mock interviews 🎤", value: "mock-interview" },
    {
      label: "I want to use open source projects 📦",
      value: "opensource-consumer",
    },
    { label: "Other 🌟", value: "other" },
  ];

  // Refs
  const loginDataRef = useRef({ email: "", password: "" });
  const signupDataRef = useRef({ email: "" });

  // Signup form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDOB] = useState("");
  const [profileImage, setprofileImage] = useState(null);
  const [collegeName, setcollegeName] = useState("");
  const [degreeName, setdegreeName] = useState("");
  const [currentSemester, setcurrentSemester] = useState("");
  const [preferredLanguage, setpreferredLanguage] = useState([]);
  const [pastProjects, setpastProjects] = useState("");
  const [purpose, setpurpose] = useState("");
  const [github, setgithub] = useState("");
  const [linkedin, setlinkedin] = useState("");
  const hasNavigatedRef = useRef(false);

  // Effects
  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => setOtpTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);
  useEffect(() => {
    if (error) {
      setModalContent({
        title: "Error! 😬",
        message: error,
        icon: "😬",
      });
      setShowModal(true);
    }
  }, [error]);

  useEffect(() => {
    if (otpSent) {
      setShowOTP(true);
      setOtpTimer(OTP_EXPIRY_TIME);
      signupDataRef.current.email = email;
    }
  }, [otpSent, email]);
  useEffect(() => {
    if (otpVerified && isAuthenticated && !hasNavigatedRef.current) {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");

      if (token && user) {
        hasNavigatedRef.current = true; // Prevent repeat execution

        setModalContent({
          title: "Success! ✅",
          message: "OTP Verified Successfully. Redirecting...",
          icon: "✅",
        });
        setShowModal(true);

        const timeout = setTimeout(() => {
          navigate("/");
        }, 1000);

        return () => clearTimeout(timeout); // Cleanup timeout
      }
    }
  }, [otpVerified, isAuthenticated, navigate]);

  // Handlers
  const handleLoginChange = useCallback((e) => {
    loginDataRef.current = {
      ...loginDataRef.current,
      [e.target.name]: e.target.value,
    };
  }, []);

  const handleEmojiSelect = useCallback((emoji) => {
    setSelectedEmoji(emoji);
    setprofileImage(emoji);
  }, []);

  const handleLogin = useCallback(
    async (e) => {
      e.preventDefault();
      console.log(loginDataRef.current);
      const { payload } = await dispatch(loginUser(loginDataRef.current));
      console.log("LOGIN PAYLOAD: ", payload);
      if (payload !== "Login failed") {
        setModalContent({
          title: "Success! ✨",
          message: payload,
          icon: "✨",
        });
        setShowModal(true);
      }
    },
    [dispatch]
  );

  const handleSignup = async () => {
    try {
      const signupData = {
        fullName,
        email,
        phone,
        password,
        dob,
        profileImage,
        collegeName,
        degreeName,
        currentSemester: Number(currentSemester),
        preferredLanguage,
        pastProjects: pastProjects
          .split(",")
          .map((p) => p.trim())
          .filter((p) => p),
        purpose:
          purposeData.find((item) => item.value === purpose)?.value || purpose,
        github,
        linkedin,
      };

      signupDataRef.current.email = email;

      // const { payload } = await dispatch(signupUser(signupData));
      // console.log("SIGNUP PAYLOAD: ", payload);
      // if (payload !== "Signup failed") {
      //   setModalContent({
      //     title: "Success! ✨",
      //     message: payload,
      //     icon: "✨",
      //   });
      //   setShowModal(true);
      // }
      console.log(signupData);
      const response = await axios.post(
        "http://localhost:8000/api/auth/signup",
        signupData
      );
      console.log(response);
      if (response?.status == "201") {
        setModalContent({
          title: "Success! ✨",
          message: response?.data?.message,
          icon: "✨",
        });
        setShowModal(true);
        setShowOTP(true);
      }
    } catch (error) {
      console.log("Error Signing Up: ", error);
    }
  };

  const handleOTPSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (otp.length === 6) {
        dispatch(
          verifyOTP({
            email: signupDataRef.current.email,
            otp: otp,
          })
        );
      }
    },
    [dispatch, otp]
  );

  const handleResendOTP = useCallback(() => {
    if (otpTimer === 0) {
      dispatch(resendOTP({ email: signupDataRef.current.email }));
      setOtpTimer(OTP_EXPIRY_TIME);
    }
  }, [dispatch, otpTimer]);

  const handleGoogleAuth = useCallback(() => {
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
  }, []);

  const nextStep = useCallback(
    () => setCurrentStep((s) => (s < 3 ? s + 1 : s)),
    []
  );

  const prevStep = useCallback(
    () => setCurrentStep((s) => (s > 1 ? s - 1 : s)),
    []
  );

  const closeModal = useCallback(() => {
    setShowModal(false);
    dispatch(clearError());
    if (modalContent.title === "Success! ✨" && otpVerified) {
      navigate("/");
    }
  }, [dispatch, modalContent]);

  // Helper function
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Format date for display
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";

    // If it's already in YYYY-MM-DD format, return it
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }

    // Try to parse date and format it
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    } catch (e) {
      return "";
    }
  };

  return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative overflow-hidden">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-purple-600 mb-2">
            CreateIt 🤖
          </h1>
          <p className="text-gray-600 font-medium">
            {showOTP
              ? "Almost there! 🎯"
              : isLogin
              ? "Welcome back! 👋"
              : "Join our community! 🎉"}
          </p>
        </div>

        {/* Main content */}
        {showOTP ? (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">📱</div>
              <h3 className="text-2xl font-bold text-purple-600 mb-2">
                Verify Your Email
              </h3>
              <p className="text-gray-600 mb-6">
                We've sent a 6-digit code to {signupDataRef.current.email}
              </p>
            </div>

            <form onSubmit={handleOTPSubmit}>
              <input
                className="input"
                type="text"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="Enter 6-digit OTP"
                className="w-full p-4 border-3 border-purple-200 rounded-2xl text-lg font-medium text-center tracking-widest focus:border-purple-500 focus:outline-none transition-all duration-300 focus:scale-105"
                maxLength="6"
                autoComplete="one-time-code"
              />

              <button
                type="submit"
                disabled={otp.length !== 6 || isLoading}
                className={`w-full mt-4 py-4 bg-purple-500 text-white rounded-2xl font-bold text-lg transition-all duration-300 hover:bg-purple-600 hover:scale-105 ${
                  otp.length !== 6 || isLoading
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {isLoading ? "Verifying... ⏳" : "Verify & Continue 🚀"}
              </button>
            </form>

            <div className="text-center">
              {otpTimer > 0 ? (
                <p className="text-gray-500">
                  Sending OTP : {formatTime(otpTimer)}
                </p>
              ) : (
                <button
                  onClick={handleResendOTP}
                  className="text-purple-500 font-bold hover:text-purple-600 transition-colors"
                >
                  Send OTP 🔄
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Auth mode toggle */}
            <div className="flex bg-gray-100 rounded-2xl p-2 mb-8">
              {["Login 🔑", "Sign Up 🎯"].map((text, i) => (
                <button
                  key={text}
                  onClick={() => {
                    setIsLogin(!i);
                    setCurrentStep(1);
                  }}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all duration-300 ${
                    isLogin === !i
                      ? "bg-purple-500 text-white shadow-lg scale-105"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {text}
                </button>
              ))}
            </div>

            {/* Forms */}
            {isLogin ? (
              <form onSubmit={handleLogin} className="space-y-6">
                {["email", "password"].map((field) => (
                  <input
                    className="input"
                    key={field}
                    type={field === "email" ? "email" : "password"}
                    name={field}
                    placeholder={
                      field === "email" ? "Email Address 📧" : "Password 🔒"
                    }
                    defaultValue={loginDataRef.current[field]}
                    onChange={handleLoginChange}
                    className="w-full p-4 border-3 border-purple-200 rounded-2xl text-lg font-medium focus:border-purple-500 focus:outline-none transition-all duration-300 focus:scale-105"
                    required
                  />
                ))}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-4 bg-purple-500 text-white rounded-2xl font-bold text-lg transition-all duration-300 hover:bg-purple-600 hover:scale-105 ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? "Logging in... ⏳" : "Login & Code! 🚀"}
                </button>
              </form>
            ) : (
              <div>
                {/* Step indicator */}
                <div className="flex justify-center mb-6">
                  {[1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className={`w-3 h-3 rounded-full transition-all duration-300 mx-1 ${
                        step <= currentStep ? "bg-purple-500" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>

                {/* Current step */}
                {currentStep === 1 && (
                  <PersonalDetailsStep
                    fullName={fullName}
                    setFullName={setFullName}
                    email={email}
                    setEmail={setEmail}
                    phone={phone}
                    setPhone={setPhone}
                    dob={dob}
                    setDOB={setDOB}
                    password={password}
                    setPassword={setPassword}
                    selectedEmoji={selectedEmoji}
                    handleEmojiSelect={handleEmojiSelect}
                    EMOJIS={EMOJIS}
                    formatDateForInput={formatDateForInput}
                  />
                )}
                {currentStep === 2 && (
                  <EducationStep
                    collegeName={collegeName}
                    setcollegeName={setcollegeName}
                    degreeName={degreeName}
                    setdegreeName={setdegreeName}
                    currentSemester={currentSemester}
                    setcurrentSemester={setcurrentSemester}
                  />
                )}
                {currentStep === 3 && (
                  <ProfilingStep
                    preferredLanguage={preferredLanguage}
                    setpreferredLanguage={setpreferredLanguage}
                    pastProjects={pastProjects}
                    setpastProjects={setpastProjects}
                    purpose={purpose}
                    setpurpose={setpurpose}
                    github={github}
                    setgithub={setgithub}
                    linkedin={linkedin}
                    setlinkedin={setlinkedin}
                    purposeData={purposeData}
                  />
                )}

                {/* Navigation buttons */}
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
                      onClick={handleSignup}
                      disabled={isLoading}
                      className={`ml-auto px-6 py-3 bg-green-500 text-white rounded-2xl font-bold hover:bg-green-600 transition-all duration-300 hover:scale-105 ${
                        isLoading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {isLoading ? "Creating Account... ⏳" : "Join Now! 🎉"}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Social login */}
            <div className="mt-8 pt-6 border-t-2 border-gray-100">
              <p className="text-center text-gray-500 mb-4 font-medium">
                or continue with
              </p>
              <div className="flex justify-center space-x-4">
                {["Google", "GitHub", "LinkedIn"].map((provider) => (
                  <button
                    key={provider}
                    onClick={
                      provider === "Google" ? handleGoogleAuth : undefined
                    }
                    className="w-12 h-12 bg-gray-800 text-white rounded-xl font-bold hover:scale-110 transition-all duration-300 flex items-center justify-center"
                  >
                    {provider.charAt(0)}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Common Modal */}
      <Modal isOpen={showModal} onClose={closeModal} title={modalContent.title}>
        <div className="text-6xl mb-4">{modalContent.icon}</div>
        <p className="text-gray-700 mb-6">{modalContent.message}</p>
      </Modal>
    </div>
  );
};

export default AuthPage;
