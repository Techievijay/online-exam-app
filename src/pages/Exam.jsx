import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VideoRecord from "../components/VideoRecord";
import "../styles/exampage.css";
import { examCategories } from "../data/categories";

const categories = examCategories;

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

  const handleFullscreenClick = () => {
    enterFullScreen();
  };

  useEffect(() => {
    enterFullScreen();  // Attempt to enter fullscreen on component mount
    setTimeLeft(duration * 60);

    setTimeout(() => {
      if (videoRef.current) {
        console.log("Starting recording from Exam component...");
        videoRef.current.startRecording();
      } else {
        console.warn("Video reference not ready yet.");
      }
    }, 2000);

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

  const handleAnswerChange = (index) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion]: index }));
  };

  const handleContextMenu = (event) => {
    event.preventDefault();
    alert("Right-click is disabled during the exam.");
  };

  const preventKeyShortcuts = (event) => {
    if ((event.ctrlKey || event.metaKey) && ["c", "x", "v", "a"].includes(event.key)) {
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

  const progressPercentage = (currentQuestion / questions.length) * 100;

  return (
    <div className="exam-page flex flex-row" ref={examRef}>
      <VideoRecord ref={videoRef} />

      {/* Left Section */}
      <div className="exam-content w-2/3 p-6 bg-gray-100">
        <div className="exam-header text-center mb-4">
          <h1 className="text-2xl font-bold">{category.title} Exam</h1>
          <div className="flex justify-center items-center space-x-2 mt-2">
            <span className="text-lg">Time Left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}</span>
            <div className="relative w-1/2 mt-2">
              <progress value={progressPercentage} max={100} className="w-full h-2 bg-gray-300 rounded-full" />
            </div>
          </div>
        </div>

        {/* Question Section */}
        <div className="question-section mb-6">
          <p className="text-lg font-semibold">{currentQuestion + 1} / {questions.length} Questions</p>
          <p className="text-xl my-4">{questions[currentQuestion]?.question}</p>

          {/* Options */}
          {questions[currentQuestion]?.options.map((option, index) => (
  <div key={index} className="option mb-4">
    <input
      type="radio"
      name="answer"
      checked={answers[currentQuestion] === index}
      onChange={() => handleAnswerChange(index)}
      id={`option-${index}`}  // Added an id for better accessibility
    />
    <label htmlFor={`option-${index}`}>{option}</label>
  </div>
))}




        </div>

        {/* Navigation Buttons */}
        <div className="navigation flex justify-between mt-4">
          <button onClick={handlePrev} disabled={currentQuestion === 0} className="btn-prev">
            Prev
          </button>
          <button onClick={handleNext} disabled={currentQuestion === questions.length - 1} className="btn-next">
            Next
          </button>
        </div>
      </div>

      {/* Right Section */}
      <div className="right-section w-1/3 p-6 border-l border-gray-300 bg-gray-200">
        {/* Question Timeline */}
        <div className="timeline mb-6">
          <div className="grid grid-cols-4 gap-2">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`question-timeline-circle w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm ${answers[index] !== undefined ? "bg-blue-500 text-white" : "border-gray-300"}`}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Submit & Exit Buttons */}
        <div className="flex justify-between mt-4">
          <button onClick={() => navigate("/")} className="btn-exit bg-gray-500 text-white py-2 px-4 rounded-md">
            Exit
          </button>
          <button onClick={handleSubmit} className="btn-submit bg-blue-500 text-white py-2 px-4 rounded-md">
            Submit
          </button>
        </div>

        
      </div>
    </div>
  );
};

export default Exam;
