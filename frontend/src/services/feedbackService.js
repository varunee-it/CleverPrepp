import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

class FeedbackService {
  /**
   * Submit or update feedback (One review per user)
   */
  async upsertFeedback(feedbackData) {
    try {
      const response = await axiosInstance.put(API_PATHS.FEEDBACK.UPSERT, feedbackData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  /**
   * Get authenticated user's feedback
   */
  async getMyFeedback() {
    try {
      const response = await axiosInstance.get(API_PATHS.FEEDBACK.GET_MY);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  /**
   * Get public approved feedback for landing page
   * @param {string} tab - 'newest', 'top', 'helpful'
   */
  async getPublicFeedback(tab = 'newest') {
    try {
      // NOTE: For public API without auth, axiosInstance might still attach tokens.
      // But we mapped it behind API_PATHS.
      const response = await axiosInstance.get(API_PATHS.FEEDBACK.GET_PUBLIC(tab));
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  /**
   * Get overall feedback analytics (average rating, distribution)
   */
  async getFeedbackStats() {
    try {
      const response = await axiosInstance.get(API_PATHS.FEEDBACK.GET_STATS);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
}

export default new FeedbackService();
