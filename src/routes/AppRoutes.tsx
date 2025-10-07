import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Tutors from '../pages/Tutors'
import TutorProfile from '../pages/TutorProfile'
import Login from '../pages/Login'
import Register from '../pages/Register'
import StudentDashboard from '../components/StudentDashboard'
import TutorDashboard from '../components/TutorDashboard'
import Navbar from '../components/Navbar'
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
        <Route
          path="/student"
          element={<ProtectedRoute requiredRole={'STUDENT'}><StudentDashboard /></ProtectedRoute>}
        />
        <Route
          path="/tutor"
          element={<ProtectedRoute requiredRole={'TUTOR'}><TutorDashboard /></ProtectedRoute>}
        />
      </Routes>
    </AuthProvider>
  )
}
