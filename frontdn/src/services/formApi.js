import axios from "axios";

const API_URL = "http://localhost:5000"; // backend root URL

const formApi = axios.create({ baseURL: API_URL });

// Add token interceptor
formApi.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Example helpers
formApi.getForms = () => formApi.get("/forms");
formApi.getFormById = (id) => formApi.get(`/forms/${id}`);
formApi.createForm = (data) => formApi.post("/forms", data);
formApi.updateForm = (id, data) => formApi.put(`/forms/${id}`, data);
//formApi.deleteForm = (id) => formApi.delete(`/forms/${id}`);

export default formApi;
