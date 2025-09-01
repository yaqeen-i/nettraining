import React, { useEffect, useState } from "react";
import formApi from "../services/formApi";
import FormTable from "../components/FormTable";

export default function AdminDashboardPage() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        setLoading(true);
        const response = await formApi.getForms(); // Remove the "/"
        console.log("API Response:", response); // Debug log
        console.log("Response data:", response.data); // Debug log
        
        // Check if response.data is an array
        if (Array.isArray(response.data)) {
          setForms(response.data);
        } else if (response.data && Array.isArray(response.data.data)) {
          // If your backend wraps the array in a "data" property
          setForms(response.data.data);
        } else {
          console.error("Unexpected data format:", response.data);
          setError("Unexpected data format received from server");
        }
      } catch (err) {
        console.error("Error fetching forms:", err);
        setError(err.response?.data?.message || "Failed to fetch forms");
      } finally {
        setLoading(false);
      }
    };
    fetchForms();
  }, []);

  const handleEdit = updatedForm => {
    setForms(forms.map(f => (f.id === updatedForm.id ? updatedForm : f)));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (loading) return <div>Loading forms...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>
      <p>Found {forms.length} forms</p>
      <FormTable forms={forms} onEdit={handleEdit} />
    </div>
  );
}