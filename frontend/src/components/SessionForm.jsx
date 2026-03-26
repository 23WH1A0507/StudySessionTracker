import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createSession, updateSession } from '../services/api'

export default function SessionForm({ session, onSave, onCancel }) {
  const [formData, setFormData] = useState(
    session || {
      subject: '',
      duration: 0,
      date: new Date().toISOString().split('T')[0]
    }
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' ? parseInt(value) : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (session?._id) {
        await updateSession(session._id, formData)
      } else {
        await createSession(formData)
      }
      onSave()
    } catch (err) {
      setError(err.message || 'Failed to save session')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="session-form">
      <h2>{session ? 'Edit Session' : 'Add New Session'}</h2>
      
      <div className="form-group">
        <label htmlFor="subject">Subject:</label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="duration">Duration (minutes):</label>
        <input
          type="number"
          id="duration"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          min="0"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="date">Date:</label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </div>

      {error && <div className="error">{error}</div>}

      <div className="form-actions">
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  )
}
