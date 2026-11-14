import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

// ==========================================
// Get Global Analytics Data
// ==========================================
const getAnalyticsData = async () => {
  try {
    const response = await axiosInstance.get(
      API_PATHS.PROGRESS.GET_ANALYTICS
    );

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to fetch analytics data",
      }
    );
  }
};

const startFocusSession = async (payload) => {
  const response = await axiosInstance.post(`${API_PATHS.PROGRESS.BASE}/focus/start`, payload);
  return response.data;
};

const getActiveFocusSession = async () => {
  const response = await axiosInstance.get(`${API_PATHS.PROGRESS.BASE}/focus/active`);
  return response.data;
};

const pauseFocusSession = async (sessionId, payload = {}) => {
  const response = await axiosInstance.post(`${API_PATHS.PROGRESS.BASE}/focus/${sessionId}/pause`, payload);
  return response.data;
};

const resumeFocusSession = async (sessionId, payload = {}) => {
  const response = await axiosInstance.post(`${API_PATHS.PROGRESS.BASE}/focus/${sessionId}/resume`, payload);
  return response.data;
};

const heartbeatFocusSession = async (sessionId) => {
  const response = await axiosInstance.post(`${API_PATHS.PROGRESS.BASE}/focus/${sessionId}/heartbeat`);
  return response.data;
};

const completeFocusSession = async (payload) => {
  // Extract sessionId and put everything else in the body
  const { sessionId, ...bodyData } = payload;
  const response = await axiosInstance.post(`${API_PATHS.PROGRESS.BASE}/focus/${sessionId}/complete`, bodyData);
  return response.data;
};

const getStudyHistory = async (page = 1, limit = 50) => {
  const response = await axiosInstance.get(`${API_PATHS.PROGRESS.BASE}/history?page=${page}&limit=${limit}`);
  return response.data;
};

const updateFocusChecklist = async (sessionId, checklist, payload = {}) => {
  const response = await axiosInstance.patch(`${API_PATHS.PROGRESS.BASE}/focus/${sessionId}/checklist`, { checklist, ...payload });
  return response.data;
};

// ==========================================
// Export Progress Services
// ==========================================
const progressService = {
  getAnalyticsData,
  startFocusSession,
  getActiveFocusSession,
  pauseFocusSession,
  resumeFocusSession,
  heartbeatFocusSession,
  completeFocusSession,
  updateFocusChecklist,
  getStudyHistory,
};

export default progressService;