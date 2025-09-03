import axios from "axios";

const adminApi = axios.create({ baseURL: "http://localhost:5000/admin" });
adminApi.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

adminApi.getAdminById = (id) => adminApi.get(`/${id}`);

export default adminApi;