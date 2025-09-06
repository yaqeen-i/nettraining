import React, { useState } from "react";
import adminApi from "../services/adminApi";

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
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

  // Styling with AnNahar font and #522524 color scheme
  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f9f3e9",
      fontFamily: "AnNahar, sans-serif",
      padding: "20px"
    },
    loginCard: {
      backgroundColor: "#fff",
      padding: "40px",
      borderRadius: "10px",
      boxShadow: "0 5px 20px rgba(0, 0, 0, 0.1)",
      width: "100%",
      maxWidth: "400px",
      border: "2px solid #522524"
    },
    title: {
      color: "#522524",
      textAlign: "center",
      margin: "0 0 30px 0",
      fontSize: "28px",
      fontWeight: "bold"
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "20px"
    },
    input: {
      padding: "15px",
      border: "2px solid #d6c6ab",
      borderRadius: "5px",
      fontSize: "16px",
      fontFamily: "AnNahar, sans-serif",
      backgroundColor: "#fff",
      color: "#522524",
      outline: "none",
      transition: "border-color 0.3s ease",
      focus: {
        borderColor: "#522524"
      }
    },
    button: {
      backgroundColor: "#522524",
      color: "#fff",
      border: "none",
      padding: "15px",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "16px",
      fontFamily: "AnNahar, sans-serif",
      fontWeight: "bold",
      transition: "background-color 0.3s ease",
      hover: {
        backgroundColor: "#3a1a1a"
      },
      disabled: {
        backgroundColor: "#a08a83",
        cursor: "not-allowed"
      }
    },
    error: {
      color: "#d9534f",
      backgroundColor: "#fdf2f2",
      padding: "10px",
      borderRadius: "5px",
      border: "1px solid #ebccd1",
      textAlign: "center",
      fontSize: "14px"
    },
    footer: {
      textAlign: "center",
      marginTop: "20px",
      color: "#7f8c8d",
      fontSize: "14px"
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginCard}>
        <h2 style={styles.title}>تسجيل دخول المشرف</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="username"
            placeholder="اسم المستخدم"
            value={formData.username}
            onChange={handleChange}
            required
            style={styles.input}
            onFocus={(e) => {
              e.target.style.borderColor = styles.input.focus.borderColor;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#d6c6ab";
            }}
          />
          <input
            type="password"
            name="password"
            placeholder="كلمة المرور"
            value={formData.password}
            onChange={handleChange}
            required
            style={styles.input}
            onFocus={(e) => {
              e.target.style.borderColor = styles.input.focus.borderColor;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#d6c6ab";
            }}
          />
          <button 
            type="submit" 
            disabled={loading}
            style={{
              ...styles.button,
              ...(loading ? styles.button.disabled : {})
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = styles.button.hover.backgroundColor;
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = styles.button.backgroundColor;
              }
            }}
          >
            {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </button>
        </form>
        <div style={styles.footer}>
          نظام إدارة النماذج
        </div>
      </div>
    </div>
  );
}