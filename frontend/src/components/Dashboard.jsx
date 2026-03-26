import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSessions, logout, getUser } from '../services/api'
import SessionForm from './SessionForm'
import SessionList from './SessionList'

export default function Dashboard() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingSession, setEditingSession] = useState(null)
  const navigate = useNavigate()
  const user = getUser()
  const isAdmin = user?.role === 'admin'

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    setLoading(true)
    setError('')

    try {
      const data = await getSessions()
      setSessions(data)
    } catch (err) {
      setError(err.message || 'Failed to fetch sessions')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleSaveSession = () => {
    setShowForm(false)
    setEditingSession(null)
    fetchSessions()
  }

  const handleEditSession = (session) => {
    setEditingSession(session)
    setShowForm(true)
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingSession(null)
  }

  // Calculate admin statistics
  const getAdminStats = () => {
    const totalHours = (sessions.reduce((sum, s) => sum + s.duration, 0) / 60).toFixed(2)
    const uniqueStudents = new Set(sessions.map(s => s.userId?._id)).size
    return { totalHours, uniqueStudents }
  }

  const adminStats = isAdmin ? getAdminStats() : null

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Study Session Tracker</h1>
          {user && <p>Welcome, {user.name}! ({user.role.toUpperCase()})</p>}
        </div>
        <div className="header-actions">
          <button 
            onClick={() => navigate('/reports')}
            className="btn-reports"
          >
            📊 Reports
          </button>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        {loading ? (
          <div className="loading">Loading sessions...</div>
        ) : (
          <>
            {error && <div className="error">{error}</div>}

            {isAdmin && (
              <div className="admin-stats-section">
                <div className="admin-stat-card">
                  <h3>Total Sessions</h3>
                  <p className="stat-number">{sessions.length}</p>
                </div>
                <div className="admin-stat-card">
                  <h3>Total Study Hours</h3>
                  <p className="stat-number">{adminStats?.totalHours}h</p>
                </div>
                <div className="admin-stat-card">
                  <h3>Active Students</h3>
                  <p className="stat-number">{adminStats?.uniqueStudents}</p>
                </div>
              </div>
            )}

            {showForm && !isAdmin ? (
              <SessionForm
                session={editingSession}
                onSave={handleSaveSession}
                onCancel={handleCancelForm}
              />
            ) : (
              <>
                {!isAdmin && (
                  <button 
                    onClick={() => setShowForm(true)}
                    className="btn-primary"
                  >
                    + Add New Session
                  </button>
                )}
                <SessionList 
                  sessions={sessions}
                  onEdit={handleEditSession}
                  onRefresh={fetchSessions}
                  isAdmin={isAdmin}
                />
              </>
            )}
          </>
        )}
      </main>
    </div>
  )
}
