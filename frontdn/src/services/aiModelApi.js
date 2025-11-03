import axios from "axios";

// Replace this URL with your actual AI model ngrok URL
const AI_MODEL_BASE_URL = "https://9a8b8c0cd03b.ngrok-free.app"; 

const aiModelApi = axios.create({ 
  baseURL: AI_MODEL_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  }
});

aiModelApi.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Send message to AI model in the required format
aiModelApi.sendAIMessage = (question) => 
  aiModelApi.post(`/ask`, { question }); // using /ask endpoint as in FastAPI

// get endpoint if needed for UI 
aiModelApi.getUI = () => aiModelApi.get(`/ui`);

export default aiModelApi;