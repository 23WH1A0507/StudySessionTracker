import { useState } from 'react'
import { deleteSession, getUser } from '../services/api'

export default function SessionList({ sessions, onEdit, onRefresh }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const user = getUser()
  const isAdmin = user?.role === 'admin'

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this session?')) {
      return
    }

    setLoading(true)
    setError('')

    try {
      await deleteSession(id)
      onRefresh()
    } catch (err) {
      setError(err.message || 'Failed to delete session')
    } finally {
      setLoading(false)
    }
  }

  const calculateTotalHours = () => {
    const totalMinutes = sessions.reduce((sum, session) => sum + session.duration, 0)
    return (totalMinutes / 60).toFixed(2)
  }

  return (
    <div className="session-list">
      <div className="list-header">
        <h2>Study Sessions</h2>
        <div className="stats">
          <span>Total Sessions: {sessions.length}</span>
          <span>Total Hours: {calculateTotalHours()}</span>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      {sessions.length === 0 ? (
        <p className="empty-message">No sessions yet. Add your first session!</p>
      ) : (
        <table className="sessions-table">
          <thead>
            <tr>
              {isAdmin && <th>Student</th>}
              <th>Date</th>
              <th>Subject</th>
              <th>Duration (min)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map(session => (
              <tr key={session._id}>
                {isAdmin && (
                  <td>
                    <div className="student-info">
                      <strong>{session.userId?.name || 'Unknown'}</strong>
                      <div className="student-email">{session.userId?.email || ''}</div>
                    </div>
                  </td>
                )}
                <td>{new Date(session.date).toLocaleDateString()}</td>
                <td>{session.subject}</td>
                <td>{session.duration}</td>
                <td>
                  <button 
                    onClick={() => onEdit(session)}
                    className="btn-edit"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(session._id)}
                    className="btn-delete"
                    disabled={loading}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
