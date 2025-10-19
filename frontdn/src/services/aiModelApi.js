import axios from "axios";

// Replace this URL with your actual AI model ngrok URL
const AI_MODEL_BASE_URL = "/ask"; 

const aiModelApi = axios.create({ 
  baseURL: AI_MODEL_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  }
});

// Optional: Add authentication if your AI model requires it
aiModelApi.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Send message to AI model in the required format
aiModelApi.sendAIMessage = (question) => 
  aiModelApi.post(`/`, { question }); // Note: using "question" key as required

export default aiModelApi;