import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Student from './pages/Student';
import BecomeTutor from './pages/BecomeTutor';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Student />} />
        <Route path="/become-tutor" element={<BecomeTutor />} />
        <Route path="/student" element={<Student />} />
      </Routes>
    </BrowserRouter>
  );
}