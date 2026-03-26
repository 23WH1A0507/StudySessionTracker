import axios from 'axios'

const API_BASE = '/api'

// Auth APIs
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE}/auth/login`, { email, password })
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('user', JSON.stringify(response.data.user))
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

export const register = async (name, email, password, role = 'student') => {
  try {
    const response = await axios.post(`${API_BASE}/auth/register`, {
      name,
      email,
      password,
      role
    })
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('user', JSON.stringify(response.data.user))
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

export const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

// Study Session APIs
export const getSessions = async () => {
  try {
    const response = await axios.get(`${API_BASE}/sessions`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

export const createSession = async (sessionData) => {
  try {
    const response = await axios.post(`${API_BASE}/sessions`, sessionData, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

export const updateSession = async (id, sessionData) => {
  try {
    const response = await axios.put(`${API_BASE}/sessions/${id}`, sessionData, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

export const deleteSession = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE}/sessions/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

// Get all users (admin only)
export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE}/users`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

// Get user sessions
export const getUserSessions = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE}/users/${userId}/sessions`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

export const getToken = () => localStorage.getItem('token')
export const getUser = () => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}
