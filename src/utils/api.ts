/// <reference types="vite/client" />
import axios from 'axios'

interface ImportMetaEnv {
  readonly VITE_API_BASE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

const rawApiBase = (import.meta.env.VITE_API_BASE as string) || ''
// Normalize to ensure a consistent base that always ends with '/api'
const API_BASE = ((): string => {
  if (!rawApiBase) return '/api'
  const trimmed = rawApiBase.trim().replace(/\/$/, '')
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`
})()

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000, // 10 seconds
  withCredentials: true,
})

// Helpful debug in development so you can see which base URL is in use
if ((import.meta.env as any).DEV) {
  // eslint-disable-next-line no-console
  console.debug('[api] baseURL =', API_BASE)
}

// Attach token from localStorage to each request in a type-safe way
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (!config.headers) (config as any).headers = {}
  ;(config.headers as any).Authorization = token ? `Bearer ${token}` : undefined
  return config
})

// Surface validation errors from server (express-validator) as `error.validation`
// and implement a single in-flight refresh to avoid multiple simultaneous
// refresh requests when many requests fail after token expiry.
let refreshPromise: Promise<any> | null = null
api.interceptors.response.use(
  (res) => res,
  (error) => {
    // try automatic refresh on 401 responses (once)
    if (error && error.response) {
      const { status, data, config } = error.response
      // server validation errors: { errors: [...] }
      if (status === 400 && data && Array.isArray(data.errors)) {
        return Promise.reject({ ...error, validation: data.errors })
      }

      // handle 401: attempt refresh then retry original request once
      if (status === 401 && config && !(config as any)._retry) {
        ;(config as any)._retry = true

        // If a refresh is already in progress, wait for it instead of
        // starting a second refresh request.
        if (!refreshPromise) {
          refreshPromise = api.post('/auth/refresh')
            .then((r) => {
              const newToken = r.data?.token
              if (newToken) setAuthToken(newToken)
              return newToken
            })
            .catch((refreshErr) => {
              logout()
              throw refreshErr
            })
            .finally(() => { refreshPromise = null })
        }

        return refreshPromise.then((newToken) => {
          if (!newToken) return Promise.reject(error)
          // update header and retry
          if (!config.headers) config.headers = {}
          config.headers['Authorization'] = `Bearer ${newToken}`
          return api(config)
        }).catch((refreshErr) => Promise.reject(refreshErr))
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
