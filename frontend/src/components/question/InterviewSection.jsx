import React from "react";
import { Card } from "../ui/Card";
import { QuestionItem } from "./QuestionItem";

export const InterviewSection = () => {
  const questions = [
    {
      question: "What's the deal with let vs var in JavaScript? 🤔",
      difficulty: "Easy Peasy • JavaScript",
    },
    {
      question: "Explain closures in JavaScript with a cool example! 🎯",
      difficulty: "Medium Challenge • JavaScript",
    },
    {
      question: "How does React's Virtual DOM actually work? 🔮",
      difficulty: "Medium Challenge • React",
    },
    {
      question: "Python decorators - what are they and how to use 'em? 🎪",
      difficulty: "Medium Challenge • Python",
    },
  ];

  return (
    <Card className="mb-8" rotation="rotate-1">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 font-['Fredoka']">
        🧠 Brain Teasers & Interview Prep! 💡
      </h2>
      {questions.map((q, index) => (
        <QuestionItem
          key={index}
          {...q}
          rotation={index % 2 === 0 ? "-rotate-1" : "rotate-1"}
        />
      ))}
    </Card>
  );
};
