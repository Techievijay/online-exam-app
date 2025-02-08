import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Exam from './pages/Exam';
import Navbar from './components/Navbar';
import Signin from './pages/Signin';
import Signup from './pages/Signup';

const App = () => {
  return (
    <Router>
      <Main />
    </Router>
  );
};

const Main = () => {
  const location = useLocation(); // Correct place to use useLocation hook

  return (
    <>
      {/* Hide Navbar on /signin, /signup, and /exam routes */}
      {location.pathname !== '/signin' && location.pathname !== '/signup' && !location.pathname.startsWith('/exam') && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/exam/:id" element={<Exam />} />
      </Routes>
    </>
  );
};

export default App;
