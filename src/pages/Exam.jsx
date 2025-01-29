/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/exampage.css";


const categories = [
  {
    id: 1,
    title: "React",
    questions: [
      { question: "What is React?", options: ["Library", "Framework", "Language"], correct: 0 },
      { question: "What is JSX?", options: ["A markup language", "A JavaScript extension", "A CSS style"], correct: 1 }
    ],
    duration: 30
  },
  {
    id: 2,
    title: "JavaScript",
    questions: [
      { question: "When an operator’s value is NULL, the typeof returned by the unary operator is?", options: ["Boolean", "Undefined", "Object", "integer"], correct: 2 },
      { question: "Which function is used to serialize an object into a JSON string in Javascript?", options: ["stringify() ", "parse()", "convert()", "None of the Above"], correct: 0 }
    ],
    duration: 2
  }
];

const Exam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [demoUser, setDemoUser] = useState({ id: 1, fullName: 'John david', email: 'johndavid23@gmail.com', mobile: 1234589, isLogged: true, mediaURL:'' })

  const category = categories.find((cat) => cat.id.toString() === id);
  if (!category) {
    navigate('/');
    return null;
  }

  const { questions, duration } = category;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(duration * 60); // Duration in seconds
  const examRef = useRef(null);

  useEffect(() => {
    enterFullScreen();

    // Start countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit(); // Auto-submit when timer ends
        }
        return prev - 1;
      });
    }, 1000);

    // Disable right-click and other actions
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", preventKeyShortcuts);
    document.addEventListener("cut", preventCopyPaste);
    document.addEventListener("copy", preventCopyPaste);
    document.addEventListener("paste", preventCopyPaste);
    document.addEventListener("selectstart", preventSelection);

    return () => {
      clearInterval(timer);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", preventKeyShortcuts);
      document.removeEventListener("cut", preventCopyPaste);
      document.removeEventListener("copy", preventCopyPaste);
      document.removeEventListener("paste", preventCopyPaste);
      document.removeEventListener("selectstart", preventSelection);
    };
  }, []);

  useEffect(() => {
    console.log("Updated demoUser:", demoUser);
  }, [demoUser]); // Runs whenever demoUser is updated


  const enterFullScreen = () => {
    if (examRef.current && !document.fullscreenElement) {
      examRef.current.requestFullscreen().catch((err) => {
        console.error("Error enabling fullscreen:", err);
      });
    }
  };

  const exitFullScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  const handleContextMenu = (event) => {
    event.preventDefault();
    alert("Right-click is disabled during the exam.");
  };

  const preventKeyShortcuts = (event) => {
    if (
      (event.ctrlKey || event.metaKey) &&
      (event.key === "c" || event.key === "x" || event.key === "v" || event.key === "a")
    ) {
      event.preventDefault();
      alert("Copy, cut, paste, and select all actions are disabled during the exam.");
    }
  };

  const preventCopyPaste = (event) => {
    event.preventDefault();
    alert("Copy, cut, and paste actions are disabled during the exam.");
  };

  const preventSelection = (event) => {
    event.preventDefault();
  };

  const handleAnswerChange = (index) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion]: index }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    exitFullScreen(); // Exit fullscreen mode on submit

    const score = Object.keys(answers).reduce((acc, qIndex) => {
      return acc + (questions[qIndex].correct === answers[qIndex] ? 1 : 0);
    }, 0);

    setDemoUser(prevState => {
      const updatedUser = { ...prevState, score: score };
      console.log("Updated User:", updatedUser); // This will show the correct value
      return updatedUser;
    });

    alert(`Your score is ${score}/${questions.length}`);

    navigate("/"); // Navigate back to home
  };

  const handleAutoSubmit = () => {
    alert("Time's up! Your exam has been submitted automatically.");
    handleSubmit();
  };

  return (
    <div className="exam-page" ref={examRef}>
      <div className="exam-header">
        <h1>{category.title} Exam</h1>
        <p>Time Left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}</p>
      </div>
      <div className="exam-content">
        <p>{currentQuestion + 1} / {questions.length} Questions</p>
        <p>{questions[currentQuestion]?.question}</p>
        {questions[currentQuestion]?.options.map((option, index) => (
          <div key={index} className="option">
            <input
              type="radio"
              name="answer"
              checked={answers[currentQuestion] === index}
              onChange={() => handleAnswerChange(index)}
            />
            <label>{option}</label>
          </div>
        ))}
        <div className="navigation">
          <button onClick={handlePrev} disabled={currentQuestion === 0}>Prev</button>
          <button onClick={handleNext} disabled={currentQuestion === questions.length - 1}>Next</button>
        </div>
        <button className="submit" onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default Exam;
