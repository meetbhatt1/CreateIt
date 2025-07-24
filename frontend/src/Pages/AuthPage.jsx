// // Working
// import React, { useState, useEffect, useRef, useCallback } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   loginUser,
//   signupUser,
//   clearError,
//   verifyOTP,
//   resendOTP,
// } from "../redux/AuthSlice";
// import { useNavigate } from "react-router-dom";

// const AuthPage = () => {
//   const dispatch = useDispatch();
//   const { isLoading, error, isAuthenticated, otpSent, otpVerified } =
//     useSelector((state) => state.auth);
//   const navigate = useNavigate();
//   const [isLogin, setIsLogin] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [msg, setMsg] = useState("");
//   const [currentStep, setCurrentStep] = useState(1);
//   const [showOTP, setShowOTP] = useState(false);
//   const [otp, setOtp] = useState("");
//   const [otpTimer, setOtpTimer] = useState(0);

//   // Use refs to prevent re-renders
//   const loginDataRef = useRef({
//     email: "",
//     password: "",
//   });

//   const signupDataRef = useRef({
//     // Personal Details
//     fullName: "",
//     email: "",
//     phone: "",
//     password: "",
//     confirmPassword: "",
//     dob: "",
//     profileImage: "😎",

//     // Educational Details
//     collegeName: "",
//     degreeName: "",
//     currentSemester: 1,

//     // Profiling Details
//     preferredLanguage: "",
//     pastProjects: [],
//     purpose: "",
//     github: "",
//     linkedin: "",
//   });

//   const emojis = ["😎", "🤓", "🚀", "💻", "🎯", "⚡", "🔥", "🌟", "🎮", "🦄"];
//   const [selectedEmoji, setSelectedEmoji] = useState();

//   // OTP Timer Effect
//   useEffect(() => {
//     let interval;
//     if (otpTimer > 0) {
//       interval = setInterval(() => {
//         setOtpTimer((prev) => prev - 1);
//       }, 1000);
//     }
//     return () => clearInterval(interval);
//   }, [otpTimer]);

//   // Handle Redux state changes
//   useEffect(() => {
//     if (error) {
//       setShowModal(true);
//     }
//   }, [error]);

//   useEffect(() => {
//     if (otpSent && !showOTP) {
//       setShowOTP(true);
//       setOtpTimer(300); // 5 minutes
//     }
//   }, [otpSent, showOTP]);

//   useEffect(() => {
//     if (otpVerified && isAuthenticated) {
//       // Redirect to dashboard
//       window.location.href = "/dashboard";
//     }
//   }, [otpVerified, isAuthenticated]);

//   // Memoized handlers to prevent re-renders
//   const handleLoginChange = useCallback((e) => {
//     loginDataRef.current = {
//       ...loginDataRef.current,
//       [e.target.name]: e.target.value,
//     };
//   }, []);

//   const handleSignupChange = useCallback((e) => {
//     signupDataRef.current = {
//       ...signupDataRef.current,
//       [e.target.name]: e.target.value,
//     };
//   }, []);

//   const handleEmojiSelect = useCallback(
//     (emoji) => {
//       setSelectedEmoji(emoji);
//       signupDataRef.current = {
//         ...signupDataRef.current,
//         profileImage: selectedEmoji,
//       };
//       // Force re-render only for emoji selection
//       setCurrentStep(currentStep);
//     },
//     [currentStep, selectedEmoji]
//   );

//   const handleLogin = useCallback(
//     async (e) => {
//       e.preventDefault();
//       const data = await dispatch(loginUser(loginDataRef.current));
//       if (data.payload !== "Login failed") {
//         console.log(data.payload);
//         setMsg(data.payload);
//         setShowSuccessModal(true);
//         navigate("/");
//       }
//     },
//     [dispatch]
//   );

//   const handleSignup = useCallback(
//     async (e) => {
//       e.preventDefault();

//       const signupData = { ...signupDataRef.current };

//       // Convert pastProjects from comma-separated string to array
//       if (
//         signupData.pastProjects &&
//         typeof signupData.pastProjects === "string"
//       ) {
//         signupData.pastProjects = signupData.pastProjects
//           .split(",")
//           .map((p) => p.trim())
//           .filter(Boolean);
//       }

//       if (signupData.password !== signupData.confirmPassword) {
//         setShowModal(true);
//         return;
//       }

//       const data = await dispatch(signupUser(signupData));
//       console.log(data.payload);
//       if (data.payload != "Signup failed") {
//         console.log(signupData);
//         setShowSuccessModal(true);
//       }
//     },
//     [dispatch]
//   );

//   const handleOTPSubmit = useCallback(
//     async (e) => {
//       e.preventDefault();
//       if (otp.length === 6) {
//         dispatch(
//           verifyOTP({
//             email: signupDataRef.current.email,
//             otp: otp,
//           })
//         );
//       }
//     },
//     [dispatch, otp]
//   );

//   const handleResendOTP = useCallback(() => {
//     if (otpTimer === 0) {
//       dispatch(resendOTP({ email: signupDataRef.current.email }));
//       setOtpTimer(300);
//     }
//   }, [dispatch, otpTimer]);

//   const handleGoogleAuth = useCallback(() => {
//     window.location.href = "http://localhost:8000/api/auth/google";
//   }, []);

//   const nextStep = useCallback(() => {
//     if (currentStep < 3) setCurrentStep(currentStep + 1);
//   }, [currentStep]);

//   const prevStep = useCallback(() => {
//     if (currentStep > 1) setCurrentStep(currentStep - 1);
//   }, [currentStep]);

//   const closeModal = useCallback(() => {
//     setShowModal(false);
//     setShowSuccessModal(false);
//     dispatch(clearError());
//   }, [dispatch]);

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, "0")}`;
//   };

//   // OTP Verification Component
//   const OTPVerification = () => (
//     <div className="space-y-6">
//       <div className="text-center">
//         <div className="text-6xl mb-4">📱</div>
//         <h3 className="text-2xl font-bold text-purple-600 mb-2">
//           Verify Your Email
//         </h3>
//         <p className="text-gray-600 mb-6">
//           We've sent a 6-digit code to {signupDataRef.current.email}
//         </p>
//       </div>

//       <form onSubmit={handleOTPSubmit}>
//         <input
//           type="text"
//           value={otp}
//           onChange={(e) =>
//             setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
//           }
//           placeholder="Enter 6-digit OTP"
//           className="w-full p-4 border-3 border-purple-200 rounded-2xl text-lg font-medium text-center tracking-widest focus:border-purple-500 focus:outline-none transition-all duration-300 focus:scale-105"
//           maxLength="6"
//           autoComplete="one-time-code"
//         />

//         <button
//           type="submit"
//           disabled={otp.length !== 6 || isLoading}
//           className={`w-full mt-4 py-4 bg-purple-500 text-white rounded-2xl font-bold text-lg transition-all duration-300 hover:bg-purple-600 hover:scale-105 ${
//             otp.length !== 6 || isLoading ? "opacity-50 cursor-not-allowed" : ""
//           }`}
//         >
//           {isLoading ? "Verifying... ⏳" : "Verify & Continue 🚀"}
//         </button>
//       </form>

//       <div className="text-center">
//         {otpTimer > 0 ? (
//           <p className="text-gray-500">Resend OTP in {formatTime(otpTimer)}</p>
//         ) : (
//           <button
//             onClick={handleResendOTP}
//             className="text-purple-500 font-bold hover:text-purple-600 transition-colors"
//           >
//             Resend OTP 🔄
//           </button>
//         )}
//       </div>
//     </div>
//   );

//   const ErrorModal = () =>
//     showModal && (
//       <div className="fixed inset-0 shadow-black shadow-2xl bg-opacity-50 flex items-center justify-center z-50 p-4">
//         <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center transform">
//           <div className="text-6xl mb-4">😬</div>
//           <h3 className="text-xl font-bold text-red-500 mb-4">Oops!</h3>
//           <p className="text-gray-700 mb-6">
//             {error ||
//               (signupDataRef.current.password !==
//               signupDataRef.current.confirmPassword
//                 ? "Passwords do not match! 🤦‍♂️"
//                 : "Something went wrong!")}
//           </p>
//           <button
//             onClick={closeModal}
//             className="bg-red-500 text-white px-6 py-3 rounded-2xl font-bold hover:bg-red-600 transition-all duration-300 hover:scale-105"
//           >
//             Got it! 👍
//           </button>
//         </div>
//       </div>
//     );
//   const SuccessModal = () =>
//     showSuccessModal && (
//       <div className="fixed inset-0 shadow-black shadow-2xl bg-opacity-50 flex items-center justify-center z-50 p-4">
//         <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center transform">
//           <div className="text-6xl mb-4">✨</div>
//           <h3 className="text-xl font-bold text-green-500 mb-4">Way to Go!</h3>
//           <p className="text-gray-700 mb-6">{msg}</p>
//           <button
//             onClick={() => {
//               closeModal();
//               navigate("/");
//             }}
//             className="bg-red-500 text-white px-6 py-3 rounded-2xl font-bold hover:bg-green-600 transition-all duration-300 hover:scale-105"
//           >
//             Done! 👍
//           </button>
//         </div>
//       </div>
//     );

//   const PersonalDetailsStep = () => (
//     <div className="space-y-4">
//       <h3 className="text-xl font-bold text-center text-purple-600 mb-6">
//         Personal Details 👤
//       </h3>
//       <div className="flex justify-center mb-6">
//         <div className="flex flex-wrap gap-2">
//           {emojis.map((emoji) => (
//             <button
//               key={emoji}
//               type="button"
//               onClick={() => handleEmojiSelect(emoji)}
//               className={`text-3xl p-2 rounded-2xl transition-all duration-300 hover:scale-110 ${
//                 signupDataRef.current.profileImage === emoji
//                   ? "bg-purple-200 scale-110"
//                   : "hover:bg-gray-100"
//               }`}
//             >
//               {emoji}
//             </button>
//           ))}
//         </div>
//       </div>

//       <input
//         type="text"
//         name="fullName"
//         placeholder="Full Name 📝"
//         defaultValue={signupDataRef.current.fullName}
//         onChange={handleSignupChange}
//         className="w-full p-4 border-3 border-purple-200 rounded-2xl text-lg font-medium focus:border-purple-500 focus:outline-none transition-all duration-300 focus:scale-105"
//         required
//       />

//       <input
//         type="email"
//         name="email"
//         placeholder="Email Address 📧"
//         defaultValue={signupDataRef.current.email}
//         onChange={handleSignupChange}
//         className="w-full p-4 border-3 border-purple-200 rounded-2xl text-lg font-medium focus:border-purple-500 focus:outline-none transition-all duration-300 focus:scale-105"
//         required
//       />

//       <input
//         type="tel"
//         name="phone"
//         placeholder="Phone Number 📱"
//         defaultValue={signupDataRef.current.phone}
//         onChange={handleSignupChange}
//         className="w-full p-4 border-3 border-purple-200 rounded-2xl text-lg font-medium focus:border-purple-500 focus:outline-none transition-all duration-300 focus:scale-105"
//         required
//       />

//       <input
//         type="date"
//         name="dob"
//         defaultValue={signupDataRef.current.dob}
//         onChange={handleSignupChange}
//         className="w-full p-4 border-3 border-purple-200 rounded-2xl text-lg font-medium focus:border-purple-500 focus:outline-none transition-all duration-300 focus:scale-105"
//         required
//       />

//       <input
//         type="password"
//         name="password"
//         placeholder="Create Password 🔒"
//         defaultValue={signupDataRef.current.password}
//         onChange={handleSignupChange}
//         className="w-full p-4 border-3 border-purple-200 rounded-2xl text-lg font-medium focus:border-purple-500 focus:outline-none transition-all duration-300 focus:scale-105"
//         required
//       />

//       <input
//         type="password"
//         name="confirmPassword"
//         placeholder="Confirm Password 🔐"
//         defaultValue={signupDataRef.current.confirmPassword}
//         onChange={handleSignupChange}
//         className="w-full p-4 border-3 border-purple-200 rounded-2xl text-lg font-medium focus:border-purple-500 focus:outline-none transition-all duration-300 focus:scale-105"
//         required
//       />
//     </div>
//   );

//   const EducationStep = () => (
//     <div className="space-y-4">
//       <h3 className="text-xl font-bold text-center text-blue-600 mb-6">
//         Education Details 🎓
//       </h3>

//       <input
//         type="text"
//         name="collegeName"
//         placeholder="College/University Name 🏫"
//         defaultValue={signupDataRef.current.collegeName}
//         onChange={handleSignupChange}
//         className="w-full p-4 border-3 border-blue-200 rounded-2xl text-lg font-medium focus:border-blue-500 focus:outline-none transition-all duration-300 focus:scale-105"
//       />

//       <input
//         type="text"
//         name="degreeName"
//         placeholder="Degree Name 📜"
//         defaultValue={signupDataRef.current.degreeName}
//         onChange={handleSignupChange}
//         className="w-full p-4 border-3 border-blue-200 rounded-2xl text-lg font-medium focus:border-blue-500 focus:outline-none transition-all duration-300 focus:scale-105"
//       />

//       <input
//         type="number"
//         name="currentSemester"
//         placeholder="Current Semester 📚"
//         defaultValue={signupDataRef.current.currentSemester}
//         onChange={handleSignupChange}
//         className="w-full p-4 border-3 border-blue-200 rounded-2xl text-lg font-medium focus:border-blue-500 focus:outline-none transition-all duration-300 focus:scale-105"
//         min="1"
//         max="12"
//       />
//     </div>
//   );

//   const ProfilingStep = () => (
//     <div className="space-y-4">
//       <h3 className="text-xl font-bold text-center text-green-600 mb-6">
//         Tell Us About You! 🚀
//       </h3>

//       <select
//         name="preferredLanguage"
//         defaultValue={signupDataRef.current.preferredLanguage}
//         onChange={handleSignupChange}
//         className="w-full p-4 border-3 border-green-200 rounded-2xl text-lg font-medium focus:border-green-500 focus:outline-none transition-all duration-300 focus:scale-105"
//       >
//         <option value="">Preferred Programming Language 💻</option>
//         <option value="javascript">JavaScript</option>
//         <option value="python">Python</option>
//         <option value="java">Java</option>
//         <option value="cpp">C++</option>
//         <option value="react">React</option>
//         <option value="nodejs">Node.js</option>
//         <option value="other">Other</option>
//       </select>

//       <textarea
//         name="pastProjects"
//         placeholder="Past Projects (comma separated) 🛠️"
//         defaultValue={signupDataRef.current.pastProjects}
//         onChange={handleSignupChange}
//         className="w-full p-4 border-3 border-green-200 rounded-2xl text-lg font-medium focus:border-green-500 focus:outline-none transition-all duration-300 focus:scale-105 h-24 resize-none"
//       />

//       <select
//         name="purpose"
//         defaultValue={signupDataRef.current.purpose}
//         onChange={handleSignupChange}
//         className="w-full p-4 border-3 border-green-200 rounded-2xl text-lg font-medium focus:border-green-500 focus:outline-none transition-all duration-300 focus:scale-105"
//         required
//       >
//         <option value="">What brings you here? 🎯</option>
//         <option value="contributor">I want to contribute to projects 🤝</option>
//         <option value="mock-interview">I need mock interviews 🎤</option>
//         <option value="opensource-consumer">
//           I want to use open source projects 📦
//         </option>
//         <option value="other">Other 🌟</option>
//       </select>

//       <input
//         type="url"
//         name="github"
//         placeholder="GitHub Profile (optional) 🐱"
//         defaultValue={signupDataRef.current.github}
//         onChange={handleSignupChange}
//         className="w-full p-4 border-3 border-green-200 rounded-2xl text-lg font-medium focus:border-green-500 focus:outline-none transition-all duration-300 focus:scale-105"
//       />

//       <input
//         type="url"
//         name="linkedin"
//         placeholder="LinkedIn Profile (optional) 💼"
//         defaultValue={signupDataRef.current.linkedin}
//         onChange={handleSignupChange}
//         className="w-full p-4 border-3 border-green-200 rounded-2xl text-lg font-medium focus:border-green-500 focus:outline-none transition-all duration-300 focus:scale-105"
//       />
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-purple-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative overflow-hidden">
//         {/* Fun decorative elements */}
//         <div className="absolute -top-4 -right-4 text-6xl opacity-20 animate-spin">
//           ⚡
//         </div>
//         <div className="absolute -bottom-4 -left-4 text-6xl opacity-20 animate-bounce">
//           🚀
//         </div>

//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-black text-purple-600 mb-2">
//             CreateIt 🤖
//           </h1>
//           <p className="text-gray-600 font-medium">
//             {showOTP
//               ? "Almost there! 🎯"
//               : isLogin
//               ? "Welcome back, coder! 👋"
//               : "Join the coolest dev community! 🎉"}
//           </p>
//         </div>

//         {/* OTP Verification */}
//         {showOTP ? (
//           <OTPVerification />
//         ) : (
//           <>
//             {/* Tab Switcher */}
//             <div className="flex bg-gray-100 rounded-2xl p-2 mb-8">
//               <button
//                 onClick={() => {
//                   setIsLogin(true);
//                   setCurrentStep(1);
//                 }}
//                 className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all duration-300 ${
//                   isLogin
//                     ? "bg-purple-500 text-white shadow-lg transform scale-105"
//                     : "text-gray-600 hover:bg-gray-200"
//                 }`}
//               >
//                 Login 🔑
//               </button>
//               <button
//                 onClick={() => {
//                   setIsLogin(false);
//                   setCurrentStep(1);
//                 }}
//                 className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all duration-300 ${
//                   !isLogin
//                     ? "bg-purple-500 text-white shadow-lg transform scale-105"
//                     : "text-gray-600 hover:bg-gray-200"
//                 }`}
//               >
//                 Sign Up 🎯
//               </button>
//             </div>

//             {/* Login Form */}
//             {isLogin ? (
//               <div>
//                 <div className="space-y-6">
//                   <input
//                     type="email"
//                     name="email"
//                     placeholder="Email Address 📧"
//                     defaultValue={loginDataRef.current.email}
//                     onChange={handleLoginChange}
//                     className="w-full p-4 border-3 border-purple-200 rounded-2xl text-lg font-medium focus:border-purple-500 focus:outline-none transition-all duration-300 focus:scale-105"
//                     required
//                   />
//                   <input
//                     type="password"
//                     name="password"
//                     placeholder="Password 🔒"
//                     defaultValue={loginDataRef.current.password}
//                     onChange={handleLoginChange}
//                     className="input"
//                     required
//                   />
//                   <button
//                     onClick={handleLogin}
//                     disabled={isLoading}
//                     className={`input ${
//                       isLoading ? "opacity-50 cursor-not-allowed" : ""
//                     }`}
//                   >
//                     {isLoading ? "Logging in... ⏳" : "Login & Code! 🚀"}
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               /* Signup Form */
//               <div>
//                 {/* Step Progress */}
//                 <div className="flex justify-center mb-6">
//                   <div className="flex space-x-2">
//                     {[1, 2, 3].map((step) => (
//                       <div
//                         key={step}
//                         className={`w-3 h-3 rounded-full transition-all duration-300 ${
//                           step <= currentStep ? "bg-purple-500" : "bg-gray-300"
//                         }`}
//                       />
//                     ))}
//                   </div>
//                 </div>

//                 {currentStep === 1 && <PersonalDetailsStep />}
//                 {currentStep === 2 && <EducationStep />}
//                 {currentStep === 3 && <ProfilingStep />}

//                 {/* Navigation Buttons */}
//                 <div className="flex justify-between mt-8">
//                   {currentStep > 1 && (
//                     <button
//                       type="button"
//                       onClick={prevStep}
//                       className="px-6 py-3 bg-gray-300 text-gray-700 rounded-2xl font-bold hover:bg-gray-400 transition-all duration-300 hover:scale-105"
//                     >
//                       ← Back
//                     </button>
//                   )}
//                   {currentStep < 3 ? (
//                     <button
//                       type="button"
//                       onClick={nextStep}
//                       className="ml-auto px-6 py-3 bg-purple-500 text-white rounded-2xl font-bold hover:bg-purple-600 transition-all duration-300 hover:scale-105"
//                     >
//                       Next →
//                     </button>
//                   ) : (
//                     <button
//                       onClick={handleSignup}
//                       disabled={isLoading}
//                       className={`ml-auto px-6 py-3 bg-green-500 text-white rounded-2xl font-bold hover:bg-green-600 transition-all duration-300 hover:scale-105 ${
//                         isLoading ? "opacity-50 cursor-not-allowed" : ""
//                       }`}
//                     >
//                       {isLoading
//                         ? "Creating Account... ⏳"
//                         : "Join CodeBuddy! 🎉"}
//                     </button>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Social Login */}
//             <div className="mt-8 pt-6 border-t-2 border-gray-100">
//               <p className="text-center text-gray-500 mb-4 font-medium">
//                 or continue with
//               </p>
//               <div className="flex justify-center space-x-4">
//                 <button
//                   onClick={handleGoogleAuth}
//                   className="w-12 h-12 bg-red-500 text-white rounded-xl font-bold hover:scale-110 transition-all duration-300"
//                 >
//                   G
//                 </button>
//                 <button className="w-12 h-12 bg-gray-800 text-white rounded-xl font-bold hover:scale-110 transition-all duration-300">
//                   G
//                 </button>
//                 <button className="w-12 h-12 bg-blue-600 text-white rounded-xl font-bold hover:scale-110 transition-all duration-300">
//                   D
//                 </button>
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//       <ErrorModal />
//       <SuccessModal />
//     </div>
//   );
// };

// export default AuthPage;

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  loginUser,
  signupUser,
  clearError,
  verifyOTP,
  resendOTP,
} from "../redux/AuthSlice";

// Constants
const EMOJIS = ["😎", "🤓", "🚀", "💻", "🎯", "⚡", "🔥", "🌟", "🎮", "🦄"];
const OTP_EXPIRY_TIME = 300; // 5 minutes in seconds

const AuthPage = () => {
  // Hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated, otpSent, otpVerified } =
    useSelector((state) => state.auth);

  // State
  const [isLogin, setIsLogin] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [msg, setMsg] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpTimer, setOtpTimer] = useState(0);
  const [selectedEmoji, setSelectedEmoji] = useState("😎");

  // Refs for form data
  const loginDataRef = useRef({ email: "", password: "" });
  const signupDataRef = useRef({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    dob: "",
    profileImage: "😎",
    collegeName: "",
    degreeName: "",
    currentSemester: 1,
    preferredLanguage: "",
    pastProjects: [],
    purpose: "",
    github: "",
    linkedin: "",
  });

  // Effects
  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => setOtpTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  useEffect(() => {
    if (error) setShowModal(true);
    if (otpSent && !showOTP) {
      setShowOTP(true);
      setOtpTimer(OTP_EXPIRY_TIME);
    }
    if (otpVerified && isAuthenticated) {
      navigate("/dashboard");
    }
  }, [error, otpSent, showOTP, otpVerified, isAuthenticated, navigate]);

  // Handlers
  const handleLoginChange = useCallback((e) => {
    loginDataRef.current = {
      ...loginDataRef.current,
      [e.target.name]: e.target.value,
    };
  }, []);

  const handleSignupChange = useCallback((e) => {
    signupDataRef.current = {
      ...signupDataRef.current,
      [e.target.name]: e.target.value,
    };
  }, []);

  const handleEmojiSelect = useCallback((emoji) => {
    setSelectedEmoji(emoji);
    signupDataRef.current.profileImage = emoji;
  }, []);

  const handleLogin = useCallback(
    async (e) => {
      e.preventDefault();
      const { payload } = await dispatch(loginUser(loginDataRef.current));
      if (payload !== "Login failed") {
        setMsg(payload);
        setShowSuccessModal(true);
      }
    },
    [dispatch]
  );

  const handleSignup = useCallback(
    async (e) => {
      e.preventDefault();
      const signupData = { ...signupDataRef.current };

      if (signupData.password !== signupData.confirmPassword) {
        setShowModal(true);
        return;
      }

      if (typeof signupData.pastProjects === "string") {
        signupData.pastProjects = signupData.pastProjects
          .split(",")
          .map((p) => p.trim())
          .filter(Boolean);
      }

      const { payload } = await dispatch(signupUser(signupData));
      if (payload !== "Signup failed") {
        setShowSuccessModal(true);
      }
    },
    [dispatch]
  );

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
    setShowSuccessModal(false);
    dispatch(clearError());
  }, [dispatch]);

  // Memoized components
  const OTPVerification = useMemo(
    () => () =>
      (
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
                Resend OTP in {formatTime(otpTimer)}
              </p>
            ) : (
              <button
                onClick={handleResendOTP}
                className="text-purple-500 font-bold hover:text-purple-600 transition-colors"
              >
                Resend OTP 🔄
              </button>
            )}
          </div>
        </div>
      ),
    [otp, otpTimer, isLoading, handleOTPSubmit, handleResendOTP]
  );

  const ErrorModal = useMemo(
    () => () =>
      (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center animate-fade-in">
            <div className="text-6xl mb-4">😬</div>
            <h3 className="text-xl font-bold text-red-500 mb-4">Oops!</h3>
            <p className="text-gray-700 mb-6">
              {error || "Something went wrong!"}
            </p>
            <button
              onClick={closeModal}
              className="bg-red-500 text-white px-6 py-3 rounded-2xl font-bold hover:bg-red-600 transition-all duration-300 hover:scale-105"
            >
              Got it! 👍
            </button>
          </div>
        </div>
      ),
    [error, closeModal]
  );

  const SuccessModal = useMemo(
    () => () =>
      (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center animate-fade-in">
            <div className="text-6xl mb-4">✨</div>
            <h3 className="text-xl font-bold text-green-500 mb-4">Success!</h3>
            <p className="text-gray-700 mb-6">{msg}</p>
            <button
              onClick={() => {
                navigate("/");
                closeModal();
              }}
              className="bg-green-500 text-white px-6 py-3 rounded-2xl font-bold hover:bg-green-600 transition-all duration-300 hover:scale-105"
            >
              Continue 🚀
            </button>
          </div>
        </div>
      ),
    [msg, closeModal, navigate]
  );

  // Step components
  const PersonalDetailsStep = useMemo(
    () => () =>
      (
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

          {[
            { name: "fullName", placeholder: "Full Name 📝", type: "text" },
            { name: "email", placeholder: "Email Address 📧", type: "email" },
            { name: "phone", placeholder: "Phone Number 📱", type: "tel" },
            { name: "dob", placeholder: "", type: "date" },
            {
              name: "password",
              placeholder: "Create Password 🔒",
              type: "password",
            },
            {
              name: "confirmPassword",
              placeholder: "Confirm Password 🔐",
              type: "password",
            },
          ].map((field) => (
            <input
              key={field.name}
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              defaultValue={signupDataRef.current[field.name]}
              onChange={handleSignupChange}
              className="w-full p-4 border-3 border-purple-200 rounded-2xl text-lg font-medium focus:border-purple-500 focus:outline-none transition-all duration-300 focus:scale-105"
              required
            />
          ))}
        </div>
      ),
    [handleSignupChange, handleEmojiSelect, selectedEmoji]
  );

  const EducationStep = useMemo(
    () => () =>
      (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-center text-blue-600 mb-6">
            Education Details 🎓
          </h3>
          {[
            {
              name: "collegeName",
              placeholder: "College/University Name 🏫",
              type: "text",
            },
            { name: "degreeName", placeholder: "Degree Name 📜", type: "text" },
            {
              name: "currentSemester",
              placeholder: "Current Semester 📚",
              type: "number",
              min: 1,
              max: 12,
            },
          ].map((field) => (
            <input
              key={field.name}
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              defaultValue={signupDataRef.current[field.name]}
              onChange={handleSignupChange}
              className="w-full p-4 border-3 border-blue-200 rounded-2xl text-lg font-medium focus:border-blue-500 focus:outline-none transition-all duration-300 focus:scale-105"
              min={field.min}
              max={field.max}
            />
          ))}
        </div>
      ),
    [handleSignupChange]
  );

  const ProfilingStep = useMemo(
    () => () =>
      (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-center text-green-600 mb-6">
            Tell Us About You! 🚀
          </h3>

          <select
            name="preferredLanguage"
            defaultValue={signupDataRef.current.preferredLanguage}
            onChange={handleSignupChange}
            className="w-full p-4 border-3 border-green-200 rounded-2xl text-lg font-medium focus:border-green-500 focus:outline-none transition-all duration-300 focus:scale-105"
          >
            <option value="">Preferred Programming Language 💻</option>
            {[
              "JavaScript",
              "Python",
              "Java",
              "C++",
              "React",
              "Node.js",
              "Other",
            ].map((lang) => (
              <option key={lang} value={lang.toLowerCase()}>
                {lang}
              </option>
            ))}
          </select>

          <textarea
            name="pastProjects"
            placeholder="Past Projects (comma separated) 🛠️"
            defaultValue={signupDataRef.current.pastProjects}
            onChange={handleSignupChange}
            className="w-full p-4 border-3 border-green-200 rounded-2xl text-lg font-medium focus:border-green-500 focus:outline-none transition-all duration-300 focus:scale-105 h-24 resize-none"
          />

          <select
            name="purpose"
            defaultValue={signupDataRef.current.purpose}
            onChange={handleSignupChange}
            className="w-full p-4 border-3 border-green-200 rounded-2xl text-lg font-medium focus:border-green-500 focus:outline-none transition-all duration-300 focus:scale-105"
            required
          >
            <option value="">What brings you here? 🎯</option>
            {[
              "I want to contribute to projects 🤝",
              "I need mock interviews 🎤",
              "I want to use open source projects 📦",
              "Other 🌟",
            ].map((option, i) => (
              <option key={i} value={option.split(" ")[0].toLowerCase()}>
                {option}
              </option>
            ))}
          </select>

          {["github", "linkedin"].map((field) => (
            <input
              key={field}
              type="url"
              name={field}
              placeholder={`${
                field.charAt(0).toUpperCase() + field.slice(1)
              } Profile (optional) ${field === "github" ? "🐱" : "💼"}`}
              defaultValue={signupDataRef.current[field]}
              onChange={handleSignupChange}
              className="w-full p-4 border-3 border-green-200 rounded-2xl text-lg font-medium focus:border-green-500 focus:outline-none transition-all duration-300 focus:scale-105"
            />
          ))}
        </div>
      ),
    [handleSignupChange]
  );

  // Helper function
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-4 -right-4 text-6xl opacity-20 animate-spin">
          ⚡
        </div>
        <div className="absolute -bottom-4 -left-4 text-6xl opacity-20 animate-bounce">
          🚀
        </div>

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
          <OTPVerification />
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
                {[PersonalDetailsStep, EducationStep, ProfilingStep][
                  currentStep - 1
                ]()}

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

      {/* Modals */}
      {showModal && <ErrorModal />}
      {showSuccessModal && <SuccessModal />}
    </div>
  );
};

export default AuthPage;
