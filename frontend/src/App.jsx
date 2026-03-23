import { React, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import { Routes, Route, Navigate } from 'react-router-dom'
import CaptureFace from './pages/AttendancePage'
import AddStudent from './pages/AddStudent'
import AttendanceReport from './pages/AttendanceReport'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

function App() {
  const role = localStorage.getItem("role");



  return (
    <>
      <Routes>
        <Route path="/" element={role === "student"
          ? <CaptureFace />
          : role === "admin"
            ? <Navigate to="/dashboard" />
            : <Navigate to="/login" />} />
        <Route path="/AddStudent" element={<AddStudent />} />
        <Route path="/AttendanceReport" element={role === "admin" ? <AttendanceReport /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={role === "admin" ? <Dashboard /> : <Navigate to="/login" />} />
      </Routes>

    </>
  )
}

export default App
