import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://zealthy-backend-iyk1.onrender.com/api';

export const wellnessService = {
  /**
   * Fetches the user's dashboard metrics from the Flask backend.
   * Requires a valid JWT token in the cookies.
   */
  getMetrics: async () => {
    const token = Cookies.get('token');
    const response = await axios.get(`${API_URL}/wellness/dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  /**
   * Fetches external aggregated data (sleep and steps) via the backend proxy.
   */
  getExternalData: async () => {
    const token = Cookies.get('token');
    const response = await axios.get(`${API_URL}/external/data`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  /**
   * Submits a new hydration record to the database.
   * @param glasses - Number of water glasses consumed.
   * @param date - The date of the record (YYYY-MM-DD format).
   */
  addHydration: async (glasses: number, date: string) => {
    const token = Cookies.get('token');
    const response = await axios.post(`${API_URL}/wellness/hydration`, { glasses, date }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  /**
   * Submits a new nutrition record to the database.
   * @param calories - Total calories consumed.
   * @param date - The date of the record (YYYY-MM-DD format).
   */
  addNutrition: async (calories: number, date: string) => {
    const token = Cookies.get('token');
    const response = await axios.post(`${API_URL}/wellness/nutrition`, { calories, date }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  /**
   * Submits a new exercise record to the database.
   * @param duration - Duration of the exercise in minutes.
   * @param date - The date of the record (YYYY-MM-DD format).
   */
  addExercise: async (duration: number, date: string) => {
    const token = Cookies.get('token');
    const response = await axios.post(`${API_URL}/wellness/exercise`, { duration, date, type: 'General' }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  /**
   * Submits a new journal text entry to the database.
   * @param text - The journal content.
   * @param date - The date of the record (YYYY-MM-DD format).
   */
  addJournal: async (text: string, date: string) => {
    const token = Cookies.get('token');
    const response = await axios.post(`${API_URL}/wellness/journal`, { text, date }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};