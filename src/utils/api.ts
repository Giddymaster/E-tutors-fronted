/// <reference types="vite/client" />
import axios from 'axios'

interface ImportMetaEnv {
  readonly VITE_API_BASE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'
})

// Attach token from localStorage to each request in a type-safe way
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (!config.headers) (config as any).headers = {}
  ;(config.headers as any).Authorization = token ? `Bearer ${token}` : undefined
  return config
})

// Surface validation errors from server (express-validator) as `error.validation`
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error && error.response) {
      const { status, data } = error.response
      // server validation errors: { errors: [...] }
      if (status === 400 && data && Array.isArray(data.errors)) {
        return Promise.reject({ ...error, validation: data.errors })
      }
      // other structured errors (e.g., { error: 'message' })
      if (data && data.error) {
        return Promise.reject({ ...error, message: data.error })
      }
    }
    return Promise.reject(error)
  }
)

export function setAuthToken(token?: string) {
  if (token) {
    localStorage.setItem('token', token)
  } else {
    localStorage.removeItem('token')
  }
}

export function getAuthToken() {
  return localStorage.getItem('token')
}

export function logout() {
  localStorage.removeItem('token')
}

export default api
