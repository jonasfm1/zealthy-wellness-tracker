import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/api';

export const authService = {
  /**
   * Registers a new user account in the Flask backend.
   * @param email - User email address.
   * @param password - User password.
   */
  register: async (email: string, password: string) => {
    const response = await axios.post(`${API_URL}/auth/register`, { email, password });
    return response.data;
  },

  /**
   * Logs in an existing user and returns a JWT token.
   */
  login: async (email: string, password: string) => {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    return response.data;
  }
};