import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSessions, logout, getUser } from '../services/api'
import '../styles/Reports.css'

export default function Reports() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const user = getUser()

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

  // Calculate statistics
  const calculateStats = () => {
    if (sessions.length === 0) {
      return {
        totalSessions: 0,
        totalHours: 0,
        totalMinutes: 0,
        averageSessionDuration: 0,
        topSubject: 'N/A',
        studyStreak: 0
      }
    }

    const totalMinutes = sessions.reduce((sum, session) => sum + session.duration, 0)
    const averageSessionDuration = Math.round(totalMinutes / sessions.length)
    
    // Subject breakdown
    const subjectMap = {}
    sessions.forEach(session => {
      if (!subjectMap[session.subject]) {
        subjectMap[session.subject] = 0
      }
      subjectMap[session.subject] += session.duration
    })

    const topSubject = Object.keys(subjectMap).length > 0
      ? Object.entries(subjectMap).sort((a, b) => b[1] - a[1])[0][0]
      : 'N/A'

    // Calculate study streak (consecutive days with sessions)
    const sortedDates = [...new Set(sessions.map(s => new Date(s.date).toDateString()))].sort((a, b) => new Date(b) - new Date(a))
    let streak = 0
    if (sortedDates.length > 0) {
      const today = new Date()
      let currentDate = new Date(today)
      for (const dateStr of sortedDates) {
        const sessionDate = new Date(dateStr)
        if (currentDate.toDateString() === sessionDate.toDateString() || 
            (currentDate.getTime() - sessionDate.getTime()) === 86400000) {
          streak++
          currentDate = new Date(sessionDate)
        } else {
          break
        }
      }
    }

    return {
      totalSessions: sessions.length,
      totalHours: (totalMinutes / 60).toFixed(2),
      totalMinutes: totalMinutes,
      averageSessionDuration,
      topSubject,
      studyStreak: streak,
      subjectBreakdown: subjectMap
    }
  }

  const stats = calculateStats()

  // Group sessions by subject
  const subjectSessions = () => {
    const grouped = {}
    sessions.forEach(session => {
      if (!grouped[session.subject]) {
        grouped[session.subject] = []
      }
      grouped[session.subject].push(session)
    })
    return grouped
  }

  // Get max hours for chart scaling
  const getMaxHours = () => {
    const subjectHours = Object.values(stats.subjectBreakdown || {})
    return subjectHours.length > 0 ? Math.max(...subjectHours) / 60 : 1
  }

  if (loading) return <div className="reports-container"><p>Loading reports...</p></div>

  const maxHours = getMaxHours()
  const grouped = subjectSessions()

  return (
    <div className="reports-container">
      <header className="reports-header">
        <div className="header-content">
          <div>
            <h1>📊 Study Reports & Analytics</h1>
            <p>Welcome, {user?.name}</p>
          </div>
          <div className="header-actions">
            <button onClick={() => navigate('/dashboard')} className="btn-back">← Back to Dashboard</button>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </div>
        </div>
      </header>

      {error && <div className="error">{error}</div>}

      {sessions.length === 0 ? (
        <div className="empty-reports">
          <p>No study sessions yet. Start tracking your study sessions!</p>
          <button onClick={() => navigate('/dashboard')} className="btn-primary">Go to Dashboard</button>
        </div>
      ) : (
        <>
          {/* Statistics Cards */}
          <section className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📚</div>
              <div className="stat-content">
                <h3>Total Sessions</h3>
                <p className="stat-value">{stats.totalSessions}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">⏱️</div>
              <div className="stat-content">
                <h3>Total Study Time</h3>
                <p className="stat-value">{stats.totalHours} <span className="unit">hours</span></p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📈</div>
              <div className="stat-content">
                <h3>Average Duration</h3>
                <p className="stat-value">{stats.averageSessionDuration} <span className="unit">min</span></p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🔥</div>
              <div className="stat-content">
                <h3>Study Streak</h3>
                <p className="stat-value">{stats.studyStreak} <span className="unit">days</span></p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <h3>Top Subject</h3>
                <p className="stat-value">{stats.topSubject}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🎯</div>
              <div className="stat-content">
                <h3>Weekly Avg</h3>
                <p className="stat-value">{(stats.totalHours / Math.ceil(sessions.length / 7)).toFixed(1)} <span className="unit">h/week</span></p>
              </div>
            </div>
          </section>

          {/* Subject Breakdown Chart */}
          <section className="chart-section">
            <h2>📊 Study Time by Subject</h2>
            <div className="subject-chart">
              {Object.entries(stats.subjectBreakdown).length > 0 ? (
                Object.entries(stats.subjectBreakdown)
                  .sort((a, b) => b[1] - a[1])
                  .map(([subject, minutes]) => {
                    const hours = (minutes / 60).toFixed(1)
                    const percentage = ((minutes / stats.totalMinutes) * 100).toFixed(1)
                    return (
                      <div key={subject} className="chart-item">
                        <div className="chart-label">
                          <span className="subject-name">{subject}</span>
                          <span className="subject-hours">{hours}h ({percentage}%)</span>
                        </div>
                        <div className="chart-bar">
                          <div 
                            className="bar-fill" 
                            style={{ width: `${(minutes / (maxHours * 60)) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )
                  })
              ) : (
                <p>No subject data available</p>
              )}
            </div>
          </section>

          {/* Study Sessions by Subject */}
          <section className="sessions-by-subject">
            <h2>📋 Sessions by Subject</h2>
            {Object.keys(grouped).map(subject => (
              <div key={subject} className="subject-section">
                <h3>{subject}</h3>
                <div className="subject-sessions">
                  {grouped[subject]
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map(session => (
                      <div key={session._id} className="session-item">
                        <span className="session-date">{new Date(session.date).toLocaleDateString()}</span>
                        <span className="session-duration">{session.duration} min</span>
                        <span className="session-hours">({(session.duration / 60).toFixed(2)}h)</span>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </section>

          {/* Recent Sessions */}
          <section className="recent-sessions">
            <h2>📅 Recent Sessions</h2>
            <table className="recent-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Subject</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {sessions
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .slice(0, 10)
                  .map(session => (
                    <tr key={session._id}>
                      <td>{new Date(session.date).toLocaleDateString()}</td>
                      <td>{session.subject}</td>
                      <td>{session.duration} min ({(session.duration / 60).toFixed(2)}h)</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </section>
        </>
      )}
    </div>
  )
}
