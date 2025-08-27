import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import AuthPage from './components/AuthPage'
import NotesApp from './components/NotesApp'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated on app load
    const token = Cookies.get('access_token')
    if (token) {
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  const handleLogin = (token) => {
    Cookies.set('access_token', token, { expires: 7 }) // 7 days
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    Cookies.remove('access_token')
    setIsAuthenticated(false)
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/auth" 
            element={
              isAuthenticated ? 
              <Navigate to="/notes" replace /> : 
              <AuthPage onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/notes" 
            element={
              isAuthenticated ? 
              <NotesApp onLogout={handleLogout} /> : 
              <Navigate to="/auth" replace />
            } 
          />
          <Route 
            path="/" 
            element={<Navigate to={isAuthenticated ? "/notes" : "/auth"} replace />} 
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App