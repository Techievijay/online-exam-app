import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Exam from './pages/Exam';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <Router>
      {/* <Navbar />  */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/exam/:id" element={<Exam />} />
      </Routes>
    </Router>
  );
};

export default App;
