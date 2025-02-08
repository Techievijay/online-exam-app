import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Exam from './pages/Exam';
import Navbar from './components/Navbar';
import Signin from './pages/Signin';
import Signup from './pages/Signup';

const App = () => {
  return (
    <Router>
      {/* <Navbar />  */}
      <Routes>
      <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/exam/:id" element={<Exam />} />
      </Routes>
    </Router>
  );
};

export default App;
