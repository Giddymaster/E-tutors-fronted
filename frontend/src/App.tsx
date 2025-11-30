import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BecomeTutor from './pages/BecomeTutor';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/become-tutor" element={<BecomeTutor />} />
      </Routes>
    </BrowserRouter>
  );
}