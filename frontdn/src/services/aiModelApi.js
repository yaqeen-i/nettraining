import axios from "axios";

const aiModelApi = axios.create({ baseURL: "" }); 
// replace the main domain with localhost:5000 
aiModelApi.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

aiModelApi.sendAIMessage = (message) => aiModelApi.post(`/chat`, { message });
aiModelApi.getAIResponse = (query) => aiModelApi.get(`/response`, { params: { query } });

export default aiModelApi;