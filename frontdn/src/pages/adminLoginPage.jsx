import React, { useState } from "react";
import adminApi from "../services/adminApi";
import "../styles/AdminLoginPage.css";

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data } = await adminApi.post("/login", formData);
      // Save JWT token
      localStorage.setItem("token", data.token);
      // Redirect to dashboard
      window.location.href = "/admin/dashboard";
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "فشل تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">تسجيل دخول المشرف</h2>

        {error && <p className="login-error">{error}</p>}

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            name="username"
            placeholder="اسم المستخدم"
            value={formData.username}
            onChange={handleChange}
            required
            className="login-input"
          />
          <input
            type="password"
            name="password"
            placeholder="كلمة المرور"
            value={formData.password}
            onChange={handleChange}
            required
            className="login-input"
          />
          <button
            type="submit"
            disabled={loading}
            className="login-button"
          >
            {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </button>
        </form>

        <div className="login-footer">نظام إدارة النماذج</div>
      </div>
    </div>
  );
}
