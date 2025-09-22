import axios from "axios";

//frontdn/src/services/formApi.js
const API_URL = "http://localhost:5000"; // backend root URL or localhost:5000

const formApi = axios.create({ baseURL: API_URL ,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true' 
  }});

// Add token interceptor
formApi.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

formApi.getForms = () => formApi.get("/forms");
formApi.getFormById = (id) => formApi.get(`/forms/${id}`);
formApi.createForm = (data) => formApi.post("/forms", data);
formApi.updateForm = (id, data) => formApi.put(`/forms/${id}`, data);
formApi.importForms = (data) => formApi.post("/forms/import", data);

formApi.getRegions = () => formApi.get("/api/regions");
formApi.getAreas = (region) => formApi.get(`/api/areas?region=${encodeURIComponent(region)}`);
formApi.getInstitutes = (region, area) => formApi.get(`/api/institutes?region=${encodeURIComponent(region)}&area=${encodeURIComponent(area)}`);
formApi.getProfessions = (region, area, institute, gender) => 
formApi.get(`/api/professions?region=${encodeURIComponent(region)}&area=${encodeURIComponent(area)}&institute=${encodeURIComponent(institute)}&gender=${gender}`);

export default formApi;