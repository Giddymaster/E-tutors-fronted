import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Tutors from '../pages/Tutors'
import TutorProfile from '../pages/TutorProfile'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Terms from '../pages/Terms'
import Privacy from '../pages/Privacy'
import BecomeTutor from '../pages/BecomeTutor'
import Assignments from '../pages/Assignments'
import Profile from '../pages/Profile'
import OAuthCallback from '../pages/OAuthCallback'
import StudentDashboard from '../components/StudentDashboard'
import TutorDashboard from '../components/TutorDashboard'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { AuthProvider } from '../context/AuthContext'
import ProtectedRoute from './ProtectedRoute'

export default function AppRoutes() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tutors" element={<Tutors />} />
        <Route path="/tutors/:id" element={<TutorProfile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
  <Route path="/terms" element={<Terms />} />
  <Route path="/privacy" element={<Privacy />} />
  <Route path="/become-tutor" element={<BecomeTutor />} />
  <Route path="/assignments" element={<Assignments />} />
  <Route path="/oauth/callback" element={<OAuthCallback />} />
  
        <Route
          path="/student"
          element={<ProtectedRoute requiredRole={'STUDENT'}><StudentDashboard /></ProtectedRoute>}
        />
        <Route
          path="/tutor"
          element={<ProtectedRoute requiredRole={'TUTOR'}><TutorDashboard /></ProtectedRoute>}
        />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Routes>
      <Footer />
    </AuthProvider>
  )
}
