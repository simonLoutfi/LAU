import React from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Login />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;
