import React, { useEffect, useState } from "react";
import formApi from "../services/formApi";
import adminApi from "../services/adminApi";
import FormTable from "../components/FormTable";
import { jwtDecode } from "jwt-decode"; 
import "../styles/AdminDashboardPage.css";

export default function AdminDashboardPage() {
  const [forms, setForms] = useState([]);
  const [filteredForms, setFilteredForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminLoading, setAdminLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshCount, setRefreshCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [adminName, setAdminName] = useState("");

  // useEffect(() => {
  //   // Get admin name from JWT token instead of API call
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     try {
  //       const decoded = jwtDecode(token);
  //       // Assuming your JWT token contains the username field
  //       setAdminName(decoded.username || "المشرف");
  //     } catch (err) {
  //       console.error("Error decoding token:", err);
  //       setAdminName("المشرف");
  //     } finally {
  //       setAdminLoading(false);
  //     }
  //   }
  // }, []);

  useEffect(() => {
    // Fetch admin details
    const fetchAdminDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          // Decode the token to get admin ID
          const decoded = jwtDecode(token);
          const adminId = decoded.id;
          
          // Fetch admin details using the ID
          const response = await adminApi.getAdminById(adminId);
          setAdminName(response.data.username); // Assuming the response has a username field
        }
      } catch (err) {
        console.error("Error fetching admin details:", err);
      } finally {
        setAdminLoading(false);
      }
    };

    fetchAdminDetails();
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    const fetchForms = async () => {
      try {
        setLoading(true);
        const response = await formApi.getForms();
        
        if (!isMounted) return;
        
        let formsData = [];
        if (Array.isArray(response.data)) {
          formsData = response.data;
        } else if (response.data && Array.isArray(response.data.data)) {
          formsData = response.data.data;
        } else {
          console.error("Unexpected data format:", response.data);
          setError("تنسيق بيانات غير متوقع من الخادم");
          return;
        }
        
        // Deduplicate forms by ID
        const uniqueForms = formsData.filter((form, index, self) =>
          index === self.findIndex(f => f.id === form.id)
        );
        
        if (uniqueForms.length !== formsData.length) {
          console.warn(`Filtered out ${formsData.length - uniqueForms.length} duplicate forms`);
        }
        
        setForms(uniqueForms);
        setFilteredForms(uniqueForms);
      } catch (err) {
        console.error("Error fetching forms:", err);
        setError(err.response?.data?.message || "فشل في جلب النماذج");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    fetchForms();
    
    return () => {
      isMounted = false;
    };
  }, [refreshCount]);

  // Filter forms based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredForms(forms);
    } else {
      const filtered = forms.filter(form =>
        form.nationalID && form.nationalID.includes(searchTerm.trim())
      );
      setFilteredForms(filtered);
    }
  }, [searchTerm, forms]);

  const handleEdit = updatedForm => {
    const updatedForms = forms.map(f => (f.id === updatedForm.id ? updatedForm : f));
    setForms(updatedForms);
    
    // Also update filtered forms if the edited form is in the current filtered view
    if (searchTerm.trim() === "" || updatedForm.nationalID.includes(searchTerm.trim())) {
      const updatedFiltered = filteredForms.map(f => (f.id === updatedForm.id ? updatedForm : f));
      setFilteredForms(updatedFiltered);
    }
  };

  const handleRefresh = () => {
    setRefreshCount(prev => prev + 1);
    setSearchTerm(""); // Clear search on refresh
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

if (loading) {
    return (
      <div className="container">
        <div className="header">
          <div className="titleContainer">
            <h1 className="title">لوحة تحكم المشرف</h1>
          </div>
        </div>
        <div className="loadingContainer">
          <div className="spinner"></div>
          <p>جاري تحميل النماذج...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="header">
          <div className="titleContainer">
            <h1 className="title">لوحة تحكم المشرف</h1>
            <p className="welcomeText">مرحباً، {adminName}</p>
          </div>
          <div className="buttonGroup">
            <button className="button" onClick={handleRefresh}>
              ↻ تحديث
            </button>
            <button
              className="button logoutButton"
              onClick={handleLogout}
            >
              تسجيل خروج
            </button>
          </div>
        </div>
        <div className="errorContainer">
          <p className="errorText">خطأ: {error}</p>
          <button className="button" onClick={handleRefresh}>
            حاول مرة أخرى
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <div className="titleContainer">
          <h1 className="title">
            لوحة تحكم المشرف للطلاب المتقدمين - Admin Dashboard for applicants
          </h1>
          <p className="welcomeText">مرحباً، {adminName}</p>
        </div>
        <div className="buttonGroup">
          <button className="button" onClick={handleRefresh}>
            ↻ تحديث
          </button>
          <button
            className="button logoutButton"
            onClick={handleLogout}
          >
            تسجيل خروج
          </button>
        </div>
      </div>

      <div className="statsCard">
        <div className="statsInfo">
          <p className="statsNumber">{filteredForms.length}</p>
          <p className="statsLabel">
            {searchTerm ? "النماذج المصفاة" : "إجمالي نماذج التقديم"}
            {searchTerm && ` (بحث: ${searchTerm})`}
          </p>
        </div>

        <div className="searchContainer">
          <input
            type="text"
            placeholder="ابحث بالرقم الوطني..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="searchInput"
          />
          {searchTerm && (
            <button
              className="clearButton"
              onClick={clearSearch}
            >
              مسح
            </button>
          )}
        </div>
      </div>

      {filteredForms.length === 0 ? (
        <div className="noResults">
          {searchTerm ? (
            <>
              <h3>لم يتم العثور على نماذج</h3>
              <p>لا توجد نماذج تطابق الرقم الوطني: {searchTerm}</p>
              <button className="button" onClick={clearSearch}>
                عرض جميع النماذج
              </button>
            </>
          ) : (
            <h3>لا توجد نماذج متاحة</h3>
          )}
        </div>
      ) : (
        <FormTable forms={filteredForms} onEdit={handleEdit} />
      )}
    </div>
  );
}