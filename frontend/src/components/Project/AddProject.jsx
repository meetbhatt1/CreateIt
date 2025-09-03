import React, { useState } from "react";
import axios from "axios";
import {
  Upload,
  Code,
  Database,
  Image,
  Sparkles,
  Rocket,
  FileText,
  Globe,
  Users,
  Brain,
  Cloud,
  Link,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/API";

const DOMAIN_OPTIONS = ["Web Dev", "Mobile", "AI/ML", "DevOps", "Blockchain"];
const COLLAB_OPTIONS = ["Open Source", "Team Only", "Mentored"];

const getDomainIcon = (domain) => {
  switch (domain) {
    case "Web Dev":
      return <Globe className="w-5 h-5" />;
    case "Mobile":
      return <Code className="w-5 h-5" />;
    case "AI/ML":
      return <Brain className="w-5 h-5" />;
    case "DevOps":
      return <Cloud className="w-5 h-5" />;
    case "Blockchain":
      return <Link className="w-5 h-5" />;
    default:
      return <Code className="w-5 h-5" />;
  }
};

const getCollabIcon = (collab) => {
  switch (collab) {
    case "Open Source":
      return <Users className="w-5 h-5" />;
    case "Team Only":
      return <Users className="w-5 h-5" />;
    case "Mentored":
      return <Users className="w-5 h-5" />;
    default:
      return <Users className="w-5 h-5" />;
  }
};

export default function AddProject() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    domain: "",
    techStack: "",
    collaborationType: "",
  });
  const [zipFiles, setZipFiles] = useState({
    frontend: null,
    backend: null,
    envFile: null,
    dbFile: null,
  });
  const [screenshots, setScreenshots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleZipChange = (e) => {
    setZipFiles({ ...zipFiles, [e.target.name]: e.target.files[0] });
  };

  const handleScreenshotsChange = (e) => {
    setScreenshots([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const data = new FormData();
      data.append("title", form.title);
      data.append("description", form.description);
      data.append("domain", form.domain);
      data.append("collaborationType", form.collaborationType);
      // Tech stack as array
      form.techStack
        .split(",")
        .map((t) => data.append("techStack[]", t.trim()));
      // Zip files
      Object.entries(zipFiles).forEach(([key, file]) => {
        if (file) data.append(key, file);
      });
      // Screenshots
      screenshots.forEach((file) => data.append("screenshots", file));
      // OwnerId should come from auth (e.g., localStorage or redux)
      let ownerId = localStorage.getItem("userId");
      if (!ownerId) ownerId = "665f0aee4f9abcde12345678";
      data.append("ownerId", ownerId);
      // const res = await axios.post(`${API}/projects/create`, data, {
      const res = await axios.post(`${API}/projects/create`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Project created successfully!");
      setForm({
        title: "",
        description: "",
        domain: "",
        techStack: "",
        collaborationType: "",
      });
      setZipFiles({
        frontend: null,
        backend: null,
        envFile: null,
        dbFile: null,
      });
      setScreenshots([]);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error creating project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      {/* Back to Home Button */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 mb-6 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-2xl font-bold shadow hover:scale-105 transition-all"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Home
      </button>
      {/* Header */}
      <div className="transform -rotate-1 mb-8 mt-4">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-[25px] shadow-2xl p-6 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white text-center transform rotate-2 font-sans tracking-wide">
            🚀 Create Amazing Project
          </h1>
          <p className="text-purple-100 text-center mt-2 transform -rotate-1">
            Share your creativity with the world! ✨
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Main Form Container */}
        <div className="bg-white rounded-[25px] shadow-2xl p-8 border-4 border-purple-100 transform rotate-1 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-20 transform translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-20 transform -translate-x-12 translate-y-12"></div>

          {/* Message Display */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-2xl text-center font-semibold transform -rotate-1 border-3 ${
                message.includes("success")
                  ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200"
                  : "bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border-red-200"
              }`}
            >
              {message}
            </div>
          )}

          {/* FORM STARTS HERE */}
          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            {/* Project Title */}
            <div className="transform rotate-1">
              <div className="relative">
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="✨ What's your amazing project called?"
                  className="w-full p-5 border-4 border-purple-200 rounded-[20px] text-lg font-medium focus:border-purple-500 focus:outline-none transition-all duration-300 hover:shadow-lg"
                  required
                />
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center transform rotate-12">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>

            {/* Project Description */}
            <div className="transform -rotate-1">
              <div className="relative">
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="🎨 Tell us about your project... What makes it special?"
                  className="w-full p-5 border-4 border-purple-200 rounded-[20px] text-lg font-medium focus:border-purple-500 focus:outline-none min-h-[120px] transition-all duration-300 hover:shadow-lg resize-none"
                  required
                />
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center transform -rotate-12">
                  <FileText className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>

            {/* Domain and Collaboration Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="transform rotate-1">
                <div className="relative">
                  <select
                    name="domain"
                    value={form.domain}
                    onChange={handleChange}
                    className="w-full p-5 border-4 border-purple-200 rounded-[20px] text-lg font-medium focus:border-purple-500 focus:outline-none transition-all duration-300 hover:shadow-lg appearance-none bg-white"
                    required
                  >
                    <option value="">🌟 Select Your Domain</option>
                    {DOMAIN_OPTIONS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  <div className="absolute top-1/2 right-4 transform -translate-y-1/2 pointer-events-none">
                    {form.domain ? (
                      getDomainIcon(form.domain)
                    ) : (
                      <Code className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              <div className="transform -rotate-1">
                <div className="relative">
                  <select
                    name="collaborationType"
                    value={form.collaborationType}
                    onChange={handleChange}
                    className="w-full p-5 border-4 border-purple-200 rounded-[20px] text-lg font-medium focus:border-purple-500 focus:outline-none transition-all duration-300 hover:shadow-lg appearance-none bg-white"
                    required
                  >
                    <option value="">🤝 How do you want to collaborate?</option>
                    {COLLAB_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <div className="absolute top-1/2 right-4 transform -translate-y-1/2 pointer-events-none">
                    {form.collaborationType ? (
                      getCollabIcon(form.collaborationType)
                    ) : (
                      <Users className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Tech Stack */}
            <div className="transform rotate-1">
              <div className="relative">
                <input
                  type="text"
                  name="techStack"
                  value={form.techStack}
                  onChange={handleChange}
                  placeholder="💻 Tech Stack (React, Node.js, MongoDB, etc.)"
                  className="w-full p-5 border-4 border-purple-200 rounded-[20px] text-lg font-medium focus:border-purple-500 focus:outline-none transition-all duration-300 hover:shadow-lg"
                  required
                />
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-green-400 to-blue-400 rounded-full flex items-center justify-center transform rotate-45">
                  <Code className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>

            {/* File Upload Section */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-[20px] p-6 border-3 border-purple-100 transform -rotate-1">
              <h3 className="text-xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center gap-2">
                📁 Upload Your Project Files
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Frontend Zip */}
                <div className="group">
                  <label className="block font-semibold mb-2 text-gray-700 flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-pink-400 to-red-400 rounded-full flex items-center justify-center">
                      <Globe className="w-3 h-3 text-white" />
                    </div>
                    Frontend Zip
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      name="frontend"
                      accept=".zip"
                      onChange={handleZipChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="border-3 border-dashed border-purple-300 rounded-2xl p-6 text-center hover:border-purple-500 transition-all duration-300 hover:bg-purple-50 group-hover:transform group-hover:scale-105">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                      <p className="text-sm text-gray-600">
                        {zipFiles.frontend
                          ? zipFiles.frontend.name
                          : "Click to upload frontend"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Backend Zip */}
                <div className="group">
                  <label className="block font-semibold mb-2 text-gray-700 flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full flex items-center justify-center">
                      <Database className="w-3 h-3 text-white" />
                    </div>
                    Backend Zip
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      name="backend"
                      accept=".zip"
                      onChange={handleZipChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="border-3 border-dashed border-purple-300 rounded-2xl p-6 text-center hover:border-purple-500 transition-all duration-300 hover:bg-purple-50 group-hover:transform group-hover:scale-105">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                      <p className="text-sm text-gray-600">
                        {zipFiles.backend
                          ? zipFiles.backend.name
                          : "Click to upload backend"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Env File */}
                <div className="group">
                  <label className="block font-semibold mb-2 text-gray-700 flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center">
                      <FileText className="w-3 h-3 text-white" />
                    </div>
                    Env File Zip
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      name="envFile"
                      accept=".zip"
                      onChange={handleZipChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="border-3 border-dashed border-purple-300 rounded-2xl p-6 text-center hover:border-purple-500 transition-all duration-300 hover:bg-purple-50 group-hover:transform group-hover:scale-105">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                      <p className="text-sm text-gray-600">
                        {zipFiles.envFile
                          ? zipFiles.envFile.name
                          : "Click to upload env file"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* DB File */}
                <div className="group">
                  <label className="block font-semibold mb-2 text-gray-700 flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                      <Database className="w-3 h-3 text-white" />
                    </div>
                    DB File Zip
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      name="dbFile"
                      accept=".zip"
                      onChange={handleZipChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="border-3 border-dashed border-purple-300 rounded-2xl p-6 text-center hover:border-purple-500 transition-all duration-300 hover:bg-purple-50 group-hover:transform group-hover:scale-105">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                      <p className="text-sm text-gray-600">
                        {zipFiles.dbFile
                          ? zipFiles.dbFile.name
                          : "Click to upload DB file"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Screenshots Upload */}
            <div className="transform rotate-1">
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-[20px] p-6 border-3 border-pink-100">
                <label className="block font-semibold mb-4 text-gray-700 flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                    <Image className="w-3 h-3 text-white" />
                  </div>
                  📸 Project Screenshots
                </label>
                <div className="relative group">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleScreenshotsChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="border-3 border-dashed border-pink-300 rounded-2xl p-8 text-center hover:border-pink-500 transition-all duration-300 hover:bg-pink-50 group-hover:transform group-hover:scale-105">
                    <Image className="w-12 h-12 mx-auto mb-4 text-pink-400" />
                    <p className="text-lg font-semibold text-gray-700 mb-2">
                      {screenshots.length > 0
                        ? `${screenshots.length} images selected`
                        : "Drop your screenshots here"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Multiple images supported (JPG, PNG, GIF)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center transform -rotate-1">
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-12 py-5 rounded-[25px] font-bold text-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 mx-auto transform hover:rotate-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    Creating Magic...
                  </>
                ) : (
                  <>
                    <Rocket className="w-6 h-6" />
                    Launch Your Project 🚀
                  </>
                )}
              </button>
            </div>
          </form>
          {/* FORM ENDS HERE */}
        </div>
      </div>
    </div>
  );
}
