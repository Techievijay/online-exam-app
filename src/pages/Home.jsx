import React from 'react';
import { Link } from 'react-router-dom';


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
      { question: "Which function is used to serialize an object into a JSON string in Javascript?", options: ["stringify() ", "parse()", "convert()","None of the Above"], correct: 0 }
    ],
    duration: 2
  }
];

const Home = () => {
  return (
    <div className="home">
      <h1>Online Exam Dashboard</h1>
      <div className="categories">
        {categories.map((category) => (
          <div key={category.id} className="category-card">
            <h2>{category.title}</h2>
            <p>Questions: {category.questions.length}</p>
            <p>Duration: {category.duration} minutes</p>
            <Link to={`/exam/${category.id}`} className="start-button">
              Start Exam
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
