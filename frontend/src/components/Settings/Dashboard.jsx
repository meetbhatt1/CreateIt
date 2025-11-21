import React from "react";

const Dashboard = () => {
  return (
    <div className="min-h-screen font-['Comic_Neue']">
      <div className="max-w-[1400px] mx-auto bg-white rounded-[30px] shadow-2xl overflow-hidden border-[5px] border-indigo-100">
        {/* Header */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-5 text-center text-white relative">
          <h1 className="font-['Fredoka'] text-3xl font-bold text-shadow-lg mb-2">
            🚀 Dashboard
          </h1>
          <p className="text-xl opacity-90">
            Visual Layout Mockup - All Suggested Sections
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[800px]">
          {/* Left Column */}
          <div className="flex flex-col gap-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-center p-6 rounded-2xl border-[3px] border-indigo-100 shadow-lg  relative">
              <div className="before:content-['1'] before:absolute before:-top-3 before:left-5 before:bg-gradient-to-br before:from-indigo-500 before:to-purple-600 before:text-white before:w-7 before:h-7 before:rounded-full before:flex before:items-center before:justify-center before:font-bold before:text-sm before:shadow-lg">
                <div className="w-20 h-20 rounded-full bg-white text-indigo-500 flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg border-4 border-white/50">
                  😎
                </div>
                <div className="text-2xl font-bold mb-2">Hello, Alex! 👋</div>
                <div className="bg-white/20 px-4 py-2 rounded-full inline-block mb-4">
                  Level 3 Developer 🔥
                </div>
                <div className="bg-white/20 h-3 rounded-full overflow-hidden mb-4">
                  <div className="bg-gradient-to-r from-green-400 to-green-500 h-full rounded-full w-[65%]"></div>
                </div>
                <div className="text-2xl mb-4">⭐⭐⭐⭐⭐</div>
                <div className="flex gap-2 justify-center flex-wrap">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    🤝 First Collaboration
                  </span>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    🎓 Mock Mentor
                  </span>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    🔥 10 Day Streak
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 border-[3px] border-indigo-100 shadow-lg - relative">
              <div className="before:content-['3'] before:absolute before:-top-3 before:left-5 before:bg-gradient-to-br before:from-indigo-500 before:to-purple-600 before:text-white before:w-7 before:h-7 before:rounded-full before:flex before:items-center before:justify-center before:font-bold before:text-sm before:shadow-lg">
                <h3 className="font-['Fredoka'] text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  🛠️ Quick Actions
                </h3>
                <div className="flex flex-col gap-3">
                  <button className="bg-white border-2 border-indigo-100 rounded-2xl p-4 text-left cursor-pointer transition-all duration-300 flex items-center gap-3 font-semibold text-gray-700 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-600 hover:text-white hover:translate-x-2">
                    <span className="text-xl">➕</span>
                    Create New Project
                  </button>
                  <button className="bg-white border-2 border-indigo-100 rounded-2xl p-4 text-left cursor-pointer transition-all duration-300 flex items-center gap-3 font-semibold text-gray-700 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-600 hover:text-white hover:translate-x-2">
                    <span className="text-xl">👥</span>
                    Find Collaborators
                  </button>
                  <button className="bg-white border-2 border-indigo-100 rounded-2xl p-4 text-left cursor-pointer transition-all duration-300 flex items-center gap-3 font-semibold text-gray-700 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-600 hover:text-white hover:translate-x-2">
                    <span className="text-xl">📅</span>
                    Schedule Mock Interview
                  </button>
                  <button className="bg-white border-2 border-indigo-100 rounded-2xl p-4 text-left cursor-pointer transition-all duration-300 flex items-center gap-3 font-semibold text-gray-700 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-600 hover:text-white hover:translate-x-2">
                    <span className="text-xl">💬</span>
                    Join Community Discussion
                  </button>
                  <button className="bg-white border-2 border-indigo-100 rounded-2xl p-4 text-left cursor-pointer transition-all duration-300 flex items-center gap-3 font-semibold text-gray-700 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-600 hover:text-white hover:translate-x-2">
                    <span className="text-xl">🎯</span>
                    Set Weekly Goal
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column */}
          <div className="flex flex-col gap-6">
            {/* Activity Feed */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 border-[3px] border-indigo-100 shadow-lg  relative">
              <div className="before:content-['4'] before:absolute before:-top-3 before:left-5 before:bg-gradient-to-br before:from-indigo-500 before:to-purple-600 before:text-white before:w-7 before:h-7 before:rounded-full before:flex before:items-center before:justify-center before:font-bold before:text-sm before:shadow-lg">
                <h3 className="font-['Fredoka'] text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  📋 My Activity Feed
                </h3>
                <div className="space-y-3">
                  <div className="bg-white rounded-xl p-4 mb-3 border-l-4 border-indigo-500 shadow-md">
                    <div className="text-gray-800 font-medium mb-1">
                      You helped Sarah with a React mock interview
                    </div>
                    <div className="text-purple-400 text-sm">2 hours ago</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 mb-3 border-l-4 border-indigo-500 shadow-md">
                    <div className="text-gray-800 font-medium mb-1">
                      Project 'Chat App' was liked by 5 users
                    </div>
                    <div className="text-purple-400 text-sm">4 hours ago</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 mb-3 border-l-4 border-indigo-500 shadow-md">
                    <div className="text-gray-800 font-medium mb-1">
                      You completed the JavaScript challenge
                    </div>
                    <div className="text-purple-400 text-sm">1 day ago</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 mb-3 border-l-4 border-indigo-500 shadow-md">
                    <div className="text-gray-800 font-medium mb-1">
                      New collaboration request from Mike
                    </div>
                    <div className="text-purple-400 text-sm">2 days ago</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Suggested Connections */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 border-[3px] border-indigo-100 shadow-lg - relative">
              <div className="before:content-['5'] before:absolute before:-top-3 before:left-5 before:bg-gradient-to-br before:from-indigo-500 before:to-purple-600 before:text-white before:w-7 before:h-7 before:rounded-full before:flex before:items-center before:justify-center before:font-bold before:text-sm before:shadow-lg">
                <h3 className="font-['Fredoka'] text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  💡 Suggested Connections
                </h3>
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl p-4 mb-4 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-300 to-purple-400 text-white flex items-center justify-center font-bold">
                        JD
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">
                          John Doe
                        </div>
                        <div className="text-indigo-500 text-sm">
                          React, Node.js, Python
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3">
                      Looking for frontend collaboration on e-commerce project
                    </p>
                    <button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-none px-4 py-2 rounded-full cursor-pointer text-sm font-semibold">
                      Connect
                    </button>
                  </div>

                  <div className="bg-white rounded-2xl p-4 mb-4 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-300 to-purple-400 text-white flex items-center justify-center font-bold">
                        MK
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">
                          Maria Kim
                        </div>
                        <div className="text-indigo-500 text-sm">
                          Vue.js, TypeScript, AWS
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3">
                      Open source contributor seeking mentorship
                    </p>
                    <button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-none px-4 py-2 rounded-full cursor-pointer text-sm font-semibold">
                      Connect
                    </button>
                  </div>

                  <div className="bg-white rounded-2xl p-4 mb-4 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-300 to-purple-400 text-white flex items-center justify-center font-bold">
                        RS
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">
                          Robert Smith
                        </div>
                        <div className="text-indigo-500 text-sm">
                          Django, PostgreSQL, Docker
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3">
                      Backend expert available for mock interviews
                    </p>
                    <button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-none px-4 py-2 rounded-full cursor-pointer text-sm font-semibold">
                      Connect
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6">
            {/* Progress Summary */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 border-[3px] border-indigo-100 shadow-lg  relative">
              <div className="before:content-['2'] before:absolute before:-top-3 before:left-5 before:bg-gradient-to-br before:from-indigo-500 before:to-purple-600 before:text-white before:w-7 before:h-7 before:rounded-full before:flex before:items-center before:justify-center before:font-bold before:text-sm before:shadow-lg">
                <h3 className="font-['Fredoka'] text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  📈 Progress Summary
                </h3>
                <div className="text-center mb-5">
                  <div className="text-3xl mb-2">🎖️</div>
                  <div className="font-semibold text-indigo-500">
                    XP: 2,450 / 3,000
                  </div>
                  <div className="text-purple-400 mt-1">550 XP to Level 4!</div>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-md">
                  <div className="font-semibold mb-3">Recent Achievements:</div>
                  <div className="text-sm text-gray-700 leading-relaxed">
                    🏆 Completed 5 mock interviews
                    <br />
                    🎯 Maintained 15-day streak
                    <br />
                    👥 Helped 3 developers this week
                    <br />⭐ Received 4.8/5 average rating
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Panel */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 border-[3px] border-indigo-100 shadow-lg - relative">
              <div className="before:content-['6'] before:absolute before:-top-3 before:left-5 before:bg-gradient-to-br before:from-indigo-500 before:to-purple-600 before:text-white before:w-7 before:h-7 before:rounded-full before:flex before:items-center before:justify-center before:font-bold before:text-sm before:shadow-lg">
                <h3 className="font-['Fredoka'] text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  📊 My Stats
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-2xl p-4 text-center shadow-md">
                    <div className="font-['Fredoka'] text-3xl font-bold text-indigo-500 mb-1">
                      12
                    </div>
                    <div className="text-gray-700 text-sm font-semibold">
                      Projects
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl p-4 text-center shadow-md">
                    <div className="font-['Fredoka'] text-3xl font-bold text-indigo-500 mb-1">
                      28
                    </div>
                    <div className="text-gray-700 text-sm font-semibold">
                      Interviews
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl p-4 text-center shadow-md">
                    <div className="font-['Fredoka'] text-3xl font-bold text-indigo-500 mb-1">
                      47
                    </div>
                    <div className="text-gray-700 text-sm font-semibold">
                      Issues Solved
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl p-4 text-center shadow-md">
                    <div className="font-['Fredoka'] text-3xl font-bold text-indigo-500 mb-1">
                      156
                    </div>
                    <div className="text-gray-700 text-sm font-semibold">
                      Profile Views
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Weekly Challenge */}
            <div className="bg-gradient-to-br from-green-400 to-green-500 text-white text-center p-6 rounded-2xl border-[3px] border-indigo-100 shadow-lg  relative">
              <div className="before:content-['7'] before:absolute before:-top-3 before:left-5 before:bg-gradient-to-br before:from-indigo-500 before:to-purple-600 before:text-white before:w-7 before:h-7 before:rounded-full before:flex before:items-center before:justify-center before:font-bold before:text-sm before:shadow-lg">
                <div className="text-5xl mb-4">🚀</div>
                <div className="font-['Fredoka'] text-xl font-semibold mb-2">
                  Weekly Spotlight
                </div>
                <p className="mb-2">Featured Contributor</p>
                <p className="text-sm mb-4">Join Sunday Night Mock Jam</p>
                <button className="bg-white text-green-500 border-none px-6 py-3 rounded-full cursor-pointer font-semibold mt-4">
                  Join Challenge
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
