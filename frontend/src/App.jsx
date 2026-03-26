import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { getToken } from './services/api'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import Reports from './components/Reports'

const ProtectedRoute = ({ children }) => {
  const token = getToken()
  return token ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  )
}
