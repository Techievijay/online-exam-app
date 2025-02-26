import React, { useState, useEffect,useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaExclamationCircle, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "../styles/exampage.css";
import { examCategories } from "../data/categories";
import VideoRecord from '../components/VideoRecord'
const categories = examCategories;

const Exam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [showTimelinePopup, setShowTimelinePopup] = useState(false);
  const [visibleQuestions, setVisibleQuestions] = useState([...Array(4).keys()]); // Small timeline (4)
  const [fullTimelineVisibleQuestions, setFullTimelineVisibleQuestions] = useState([...Array(20).keys()]); // Full timeline (20)
  const examRef = useRef(null);
  const videoRef = useRef(null);
  const category = categories.find((cat) => cat.id.toString() === id);
  if (!category) {
    navigate("/");
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


  useEffect(() => {
    enterFullScreen(); 
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
    return () =>{
      clearInterval(timer);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", preventKeyShortcuts);
      document.removeEventListener("cut", preventCopyPaste);
      document.removeEventListener("copy", preventCopyPaste);
      document.removeEventListener("paste", preventCopyPaste);
      document.removeEventListener("selectstart", preventSelection);
      
    };
  }, []);

  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;

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

  const handleSubmit = async () => {
    exitFullScreen();
    const score = Object.keys(answers).reduce(
      (acc, qIndex) => acc + (questions[qIndex].correct === answers[qIndex] ? 1 : 0),
      0
    );
    alert(`Your score is ${score}/${questions.length}`);
  
    if (videoRef.current) {
      console.log("Stopping recording from Exam component...");
      await videoRef.current.stopRecording(); // Wait for recording to stop & download
    }
  
    navigate("/");
  };
  

  
  const handleAutoSubmit = () => {
    alert("Time's up! Your exam has been submitted automatically.");
    handleSubmit();
  };

  return (
    <div className="exam-page flex flex-col" ref={examRef}>
   
   <VideoRecord ref={videoRef} />
      <div className="timer-section text-center p-4 bg-white shadow-md fixed top-0 w-full">
        <h2 className="text-lg font-bold">
          Time Left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
        </h2>
        <progress value={progressPercentage} max={100} className="w-1/2 h-2 bg-gray-300 rounded-full mt-2" />
      </div>

      {/* Exam Content */}
      <div className="exam-content w-full p-6 flex flex-col justify-center items-center mt-16">
        <h1 className="text-2xl font-bold mb-4">{category.title} Exam</h1>

        {/* Question Section */}
        <div className="question-section w-full max-w-3xl">
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
                id={`option-${index}`}
              />
              <label htmlFor={`option-${index}`}>{option}</label>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="navigation w-full max-w-3xl flex justify-between mt-4">
          <button onClick={handlePrev} disabled={currentQuestion === 0} className="btn-prev">Prev</button>
          <button onClick={handleNext} disabled={currentQuestion === questions.length - 1} className="btn-next">Next</button>
        </div>
      </div>

      {/* Small Question Timeline */}
      <div className="fixed top-4 right-4 bg-white p-2 shadow-md rounded-md flex items-center space-x-2">
        <button onClick={() => setVisibleQuestions(prev => prev[0] > 0 ? prev.map(q => q - 1) : prev)}>
          <FaChevronLeft />
        </button>
        {visibleQuestions.map((qIndex) => (
          <div
            key={qIndex}
            className={`question-circle w-8 h-8 flex items-center justify-center rounded-full border-2 ${
              answers[qIndex] !== undefined ? "bg-blue-500 text-white" : "border-gray-300"
            }`}
            onClick={() => setCurrentQuestion(qIndex)}
          >
            {qIndex + 1}
          </div>
        ))}
        <button onClick={() => setVisibleQuestions(prev => prev[prev.length - 1] < questions.length - 1 ? prev.map(q => q + 1) : prev)}>
          <FaChevronRight />
        </button>
        <button onClick={() => setShowTimelinePopup(true)} className="text-red-500">
          <FaExclamationCircle />
        </button>
      </div>

      {/* Submit & Exit Buttons */}
      <div className="fixed bottom-4 w-full flex justify-between px-10">
        <button onClick={() => navigate("/")} className="btn-exit">Exit</button>
        <button onClick={handleSubmit} className="btn-submit">Submit</button>
      </div>

      {/* Full Question Timeline Popup */}
      {showTimelinePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md">
            <h2 className="text-lg font-bold mb-4">Full Question Timeline</h2>
            <div className="flex items-center space-x-2">
              <button onClick={() => setFullTimelineVisibleQuestions(prev => prev[0] > 0 ? prev.map(q => q - 1) : prev)}>
                <FaChevronLeft />
              </button>
              {fullTimelineVisibleQuestions.map((qIndex) => (
                <div
                  key={qIndex}
                  className={`question-circle w-10 h-10 flex items-center justify-center rounded-full border-2 ${
                    answers[qIndex] !== undefined ? "bg-blue-500 text-white" : "border-gray-300"
                  }`}
                  onClick={() => setCurrentQuestion(qIndex)}
                >
                  {qIndex + 1}
                </div>
              ))}
              <button onClick={() => setFullTimelineVisibleQuestions(prev => prev[prev.length - 1] < questions.length - 1 ? prev.map(q => q + 1) : prev)}>
                <FaChevronRight />
              </button>
            </div>
            <button onClick={() => setShowTimelinePopup(false)} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exam;
