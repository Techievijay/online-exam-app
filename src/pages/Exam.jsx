import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VideoRecord from "../components/VideoRecord";
import "../styles/exampage.css";
import { examCategories } from "../data/categories";

const categories = examCategories

const Exam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const examRef = useRef(null);
  const videoRef = useRef(null);

  const category = categories.find((cat) => cat.id.toString() === id);
  if (!category) {
    navigate('/');
    return null;
  }

  const { questions, duration } = category;

  useEffect(() => {
    setTimeLeft(duration * 60);
    enterFullScreen();

    // Wait a moment before starting recording to ensure webcam is ready
    setTimeout(() => {
      if (videoRef.current) {
        console.log("Starting recording from Exam component...");
        videoRef.current.startRecording();
      } else {
        console.warn("Video reference not ready yet.");
      }
    }, 2000);

    // Start countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
        }
        return prev - 1;
      });
    }, 1000);

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

  const enterFullScreen = () => {
    if (examRef.current && !document.fullscreenElement) {
      examRef.current.requestFullscreen().catch((err) => console.error("Error enabling fullscreen:", err));
    }
  };

  const exitFullScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  
  const handleAnswerChange = (index) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion]: index }));
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

  const preventCopyPaste = (event) => {
    event.preventDefault();
    alert("Copy, cut, and paste actions are disabled during the exam.");
  };

  const preventSelection = (event) => {
    event.preventDefault();
  };
  const handleSubmit = () => {
    exitFullScreen();

    const score = Object.keys(answers).reduce((acc, qIndex) => (
      acc + (questions[qIndex].correct === answers[qIndex] ? 1 : 0)
    ), 0);

    alert(`Your score is ${score}/${questions.length}`);

    // Stop and download video
    if (videoRef.current) {
      console.log("Stopping recording from Exam component...");
      videoRef.current.stopRecording();
    }

    navigate("/");
  };

  const handleAutoSubmit = () => {
    alert("Time's up! Your exam has been submitted automatically.");
    handleSubmit();
  };

  return (
    <div className="exam-page" ref={examRef}>
      <VideoRecord ref={videoRef} /> 

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
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default Exam;
