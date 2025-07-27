import React, { useState, useEffect } from "react";
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  Trophy,
  Star,
  Brain,
  Code,
  Coffee,
  Zap,
  CheckCircle,
  XCircle,
  Lightbulb,
} from "lucide-react";
import { Card } from "../components/ui/Card";
import { Badge, Button, Input } from "../components/ui/UI_Components";
import { useNavigate } from "react-router-dom";

const MockInterview = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [isActive, setIsActive] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [difficulty, setDifficulty] = useState("medium");
  const [category, setCategory] = useState("frontend");

  const mockUser = { name: "Alex Chen", level: 12, xp: 2847 };

  const questions = {
    frontend: {
      easy: [
        {
          id: 1,
          question:
            "What's the difference between `let`, `const`, and `var` in JavaScript? 🤔",
          hint: "Think about scope, hoisting, and reassignment!",
          type: "concept",
          timeLimit: 180,
          points: 10,
        },
        {
          id: 2,
          question:
            "Explain what a React component is and give an example of a functional component. ⚛️",
          hint: "Components are the building blocks of React applications!",
          type: "concept",
          timeLimit: 240,
          points: 15,
        },
        {
          id: 3,
          question:
            "What is CSS Flexbox and how would you center a div both horizontally and vertically? 🎨",
          hint: "Flexbox is great for alignment and distribution!",
          type: "concept",
          timeLimit: 180,
          points: 10,
        },
      ],
      medium: [
        {
          id: 4,
          question:
            "Implement a function that debounces another function. Explain when you might use this pattern. 🚀",
          hint: "Think about search inputs and API calls!",
          type: "coding",
          timeLimit: 600,
          points: 25,
        },
        {
          id: 5,
          question:
            "What are React Hooks? Explain useState and useEffect with examples. 🎣",
          hint: "Hooks let you use state and lifecycle in functional components!",
          type: "concept",
          timeLimit: 480,
          points: 20,
        },
        {
          id: 6,
          question:
            "How would you optimize a React application for performance? List at least 5 techniques. ⚡",
          hint: "Think about rendering, bundling, and user experience!",
          type: "concept",
          timeLimit: 420,
          points: 25,
        },
      ],
      hard: [
        {
          id: 7,
          question:
            "Design and implement a custom hook for managing complex form state with validation. 💪",
          hint: "Consider reusability, error handling, and performance!",
          type: "coding",
          timeLimit: 900,
          points: 40,
        },
        {
          id: 8,
          question:
            "Explain the Virtual DOM, how React uses it, and what happens during reconciliation. 🌟",
          hint: "Think about diffing algorithms and performance benefits!",
          type: "concept",
          timeLimit: 600,
          points: 35,
        },
      ],
    },
    backend: {
      easy: [
        {
          id: 9,
          question:
            "What's the difference between HTTP methods GET, POST, PUT, and DELETE? 🌐",
          hint: "Think about REST principles and idempotency!",
          type: "concept",
          timeLimit: 180,
          points: 10,
        },
      ],
      medium: [
        {
          id: 10,
          question:
            "Explain database indexing and when you would use different types of indexes. 📊",
          hint: "Consider performance trade-offs and query patterns!",
          type: "concept",
          timeLimit: 480,
          points: 25,
        },
      ],
      hard: [
        {
          id: 11,
          question:
            "Design a scalable architecture for a real-time chat application with millions of users. 🏗️",
          hint: "Think about websockets, load balancing, and data consistency!",
          type: "system-design",
          timeLimit: 1200,
          points: 50,
        },
      ],
    },
  };

  const currentQuestions = questions[category][difficulty];
  const currentQ = currentQuestions[currentQuestion];
  const totalQuestions = currentQuestions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  const navigate = useNavigate();

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((timeLeft) => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      handleFinishInterview();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartPause = () => {
    setIsActive(!isActive);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleFinishInterview();
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleAnswerChange = (value) => {
    setAnswers({
      ...answers,
      [currentQ.id]: value,
    });
  };

  const handleFinishInterview = () => {
    setIsActive(false);
    setShowResults(true);
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setTimeLeft(1800);
    setIsActive(false);
    setShowResults(false);
  };

  const calculateScore = () => {
    const answeredQuestions = Object.keys(answers).length;
    const totalPoints = currentQuestions.reduce((sum, q) => sum + q.points, 0);
    const earnedPoints = currentQuestions
      .filter((q) => answers[q.id] && answers[q.id].trim())
      .reduce((sum, q) => sum + q.points, 0);

    return {
      answered: answeredQuestions,
      total: totalQuestions,
      points: earnedPoints,
      maxPoints: totalPoints,
      percentage: Math.round((earnedPoints / totalPoints) * 100),
    };
  };

  const getScoreGrade = (percentage) => {
    if (percentage >= 90)
      return { grade: "A+", color: "text-green-600", emoji: "🏆" };
    if (percentage >= 80)
      return { grade: "A", color: "text-green-500", emoji: "🌟" };
    if (percentage >= 70)
      return { grade: "B", color: "text-blue-500", emoji: "👍" };
    if (percentage >= 60)
      return { grade: "C", color: "text-yellow-500", emoji: "📚" };
    return { grade: "D", color: "text-red-500", emoji: "💪" };
  };

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case "easy":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "hard":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "coding":
        return Code;
      case "concept":
        return Brain;
      case "system-design":
        return Lightbulb;
      default:
        return Brain;
    }
  };

  if (showResults) {
    const score = calculateScore();
    const grade = getScoreGrade(score.percentage);

    return (
      <div className="min-h-screen max-w-screen">
        <div className="pt-24 pb-16 px-6">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-lg text-center rotate-1 hover:rotate-0 transition-all duration-300">
              <div className="text-6xl mb-6">{grade.emoji}</div>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                Interview Complete!
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Here's how you performed:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className={`text-4xl font-bold ${grade.color} mb-2`}>
                    {grade.grade}
                  </div>
                  <p className="text-gray-600">Overall Grade</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-600 mb-2">
                    {score.percentage}%
                  </div>
                  <p className="text-gray-600">Score</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {score.answered}/{score.total}
                  </div>
                  <p className="text-gray-600">Questions Answered</p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Performance Breakdown
                </h3>
                <div className="bg-gray-200 rounded-full h-4 mb-2">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-blue-600 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${score.percentage}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600">
                  {score.points} / {score.maxPoints} points earned
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={handleRestart}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => {
                    /* Navigate to different category */
                  }}
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Different Category
                </Button>
                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => {
                    /* Navigate to dashboard */
                  }}
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  View Achievements
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-[fredoka] ">
      <div className="py-6 px-6">
        <div className="max-w-screen  mx-auto">
          <div className="mb-5">
            <Button
              variant="secondary"
              className="rotate-[-1.5deg]"
              onClick={() => navigate("/")}
            >
              Back
            </Button>
          </div>
          {/* Setup Screen */}
          {currentQuestion === 0 && !isActive && (
            <Card className="backdrop-blur-sm rounded-3xl p-8 shadow-lg rotate-1 hover:rotate-0 transition-all duration-300 mb-8">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">🎯</div>
                <h1 className="text-4xl font-bold text-purple-600 mb-2">
                  Mock Interview Challenge!
                </h1>
                <p className="text-gray-600 text-lg">
                  Test your skills with realistic interview questions
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Category Selection */}
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Choose Category 📚
                  </h3>
                  <div className="space-y-3">
                    {[
                      {
                        value: "frontend",
                        label: "Frontend Development",
                        icon: "⚛️",
                      },
                      {
                        value: "backend",
                        label: "Backend Development",
                        icon: "🖥️",
                      },
                      { value: "fullstack", label: "Full Stack", icon: "🚀" },
                      {
                        value: "mobile",
                        label: "Mobile Development",
                        icon: "📱",
                      },
                    ].map((cat) => (
                      <Button
                        key={cat.value}
                        onClick={() => setCategory(cat.value)}
                        variant={category === cat.value ? "default" : "outline"}
                        className={`w-full justify-start rounded-xl ${
                          category === cat.value
                            ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                            : "hover:bg-gray-100"
                        }`}
                        disabled={
                          cat.value !== "frontend" && cat.value !== "backend"
                        }
                      >
                        <span className="mr-3 text-xl">{cat.icon}</span>
                        {cat.label}
                        {cat.value !== "frontend" &&
                          cat.value !== "backend" && (
                            <Badge variant="secondary" className="ml-auto">
                              Soon
                            </Badge>
                          )}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Difficulty Selection */}
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Choose Difficulty 🎚️
                  </h3>
                  <div className="space-y-3">
                    {[
                      {
                        value: "easy",
                        label: "Easy",
                        desc: "Basic concepts & syntax",
                        questions: questions[category]?.easy?.length || 0,
                      },
                      {
                        value: "medium",
                        label: "Medium",
                        desc: "Problem solving & patterns",
                        questions: questions[category]?.medium?.length || 0,
                      },
                      {
                        value: "hard",
                        label: "Hard",
                        desc: "System design & architecture",
                        questions: questions[category]?.hard?.length || 0,
                      },
                    ].map((diff) => (
                      <Button
                        key={diff.value}
                        onClick={() => setDifficulty(diff.value)}
                        variant={
                          difficulty === diff.value ? "default" : "outline"
                        }
                        className={`w-full text-left rounded-xl h-auto p-4 ${
                          difficulty === diff.value
                            ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <div
                                className={`w-3 h-3 rounded-full ${getDifficultyColor(
                                  diff.value
                                )}`}
                              />
                              <span className="font-bold">{diff.label}</span>
                            </div>
                            <p
                              className={`text-sm ${
                                difficulty === diff.value
                                  ? "text-white/80"
                                  : "text-gray-600"
                              }`}
                            >
                              {diff.desc}
                            </p>
                          </div>
                          <Badge variant="secondary" className="rounded-full">
                            {diff.questions} questions
                          </Badge>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Button
                  onClick={() => setIsActive(true)}
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl text-xl px-8 py-4"
                >
                  <Play className="w-6 h-6 mr-3" />
                  Start Interview (30 min)
                </Button>
              </div>
            </Card>
          )}

          {/* Interview Interface */}
          {isActive && (
            <>
              {/* Header with Timer and Progress */}
              <Card className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-lg mb-6 -rotate-1 hover:rotate-0 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Badge
                      className={`${getDifficultyColor(
                        difficulty
                      )} text-white rounded-full`}
                    >
                      {difficulty.toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className="rounded-full">
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-lg font-bold text-purple-600">
                      <Clock className="w-5 h-5" />
                      {formatTime(timeLeft)}
                    </div>
                    <Button
                      onClick={handleStartPause}
                      variant="outline"
                      size="sm"
                      className="rounded-xl"
                    >
                      {isActive ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="mb-2">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>
                      {currentQuestion + 1} of {totalQuestions}
                    </span>
                  </div>
                  <p className="h-3">{progress}</p>
                </div>
              </Card>

              {/* Question Card */}
              <Card className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-lg mb-6 rotate-1 hover:rotate-0 transition-all duration-300">
                <div className="flex items-start gap-4 mb-6">
                  <div className="bg-purple-100 text-purple-600 p-3 rounded-2xl">
                    {React.createElement(getTypeIcon(currentQ.type), {
                      className: "w-6 h-6",
                    })}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold text-gray-800">
                        Question {currentQuestion + 1}
                      </h2>
                      <Badge variant="secondary" className="rounded-full">
                        {currentQ.type}
                      </Badge>
                      <Badge variant="outline" className="rounded-full">
                        {currentQ.points} pts
                      </Badge>
                    </div>
                    <p className="text-lg text-gray-700 leading-relaxed mb-4">
                      {currentQ.question}
                    </p>
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-xl">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-blue-800">Hint:</span>
                      </div>
                      <p className="text-blue-700 mt-1">{currentQ.hint}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="text-lg font-semibold text-gray-800 mb-3 block">
                    Your Answer:
                  </label>
                  <Input
                    type="textarea"
                    placeholder="Type your answer here... Be as detailed as possible!"
                    value={answers[currentQ.id] || ""}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    className="min-h-[200px] text-lg rounded-2xl"
                  />
                </div>

                <div className="flex justify-between">
                  <Button
                    onClick={handlePrevQuestion}
                    disabled={currentQuestion === 0}
                    variant="outline"
                    className="rounded-xl"
                  >
                    ← Previous
                  </Button>

                  <div className="flex gap-3">
                    {currentQuestion === totalQuestions - 1 ? (
                      <Button
                        onClick={handleFinishInterview}
                        className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl"
                      >
                        <Trophy className="w-4 h-4 mr-2" />
                        Finish Interview
                      </Button>
                    ) : (
                      <Button
                        onClick={handleNextQuestion}
                        className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl"
                      >
                        Next Question →
                      </Button>
                    )}
                  </div>
                </div>
              </Card>

              {/* Fun Motivational Card */}
              <Card className=" text-white rounded-3xl p-6 shadow-lg -rotate-2 hover:rotate-0 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">
                    {currentQuestion < totalQuestions / 3
                      ? "🚀"
                      : currentQuestion < (totalQuestions * 2) / 3
                      ? "💪"
                      : "🏆"}
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-1">
                      {currentQuestion < totalQuestions / 3
                        ? "Great start! You've got this! 🌟"
                        : currentQuestion < (totalQuestions * 2) / 3
                        ? "Halfway there! Keep pushing! ⚡"
                        : "Almost done! Finish strong! 🎯"}
                    </h3>
                    <p className="text-white/90">
                      Remember: It's not about perfect answers, it's about
                      showing your thought process!
                    </p>
                  </div>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MockInterview;
