import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// User authentication
export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

// Tutor operations
export const fetchTutors = async () => {
  const response = await api.get('/tutors');
  return response.data;
};

export const fetchTutorProfile = async (tutorId) => {
  const response = await api.get(`/tutors/${tutorId}`);
  return response.data;
};

// Student operations
export const postAssignment = async (assignmentData) => {
  const response = await api.post('/students/assignments', assignmentData);
  return response.data;
};

export const fetchStudentBookings = async () => {
  const response = await api.get('/students/bookings');
  return response.data;
};

// Payment processing
export const createPaymentSession = async (paymentData) => {
  const response = await api.post('/payment/create-session', paymentData);
  return response.data;
};

export default api;