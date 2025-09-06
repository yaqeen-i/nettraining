import React, { useEffect, useState } from "react";
import formApi from "../services/formApi";
import adminApi from "../services/adminApi";
import FormTable from "../components/FormTable";
import { jwtDecode } from "jwt-decode"; 

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

  // Styling with AnNahar font and #522524 color scheme
  const styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: "#f9f3e9",
      padding: "20px",
      fontFamily: "AnNahar, sans-serif",
      color: "#522524"
    },
    header: {
      backgroundColor: "#fff",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      marginBottom: "20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "15px",
      border: "2px solid #522524"
    },
    title: {
      color: "#522524",
      margin: "0",
      fontSize: "28px",
      fontWeight: "bold"
    },
    welcomeText: {
      color: "#522524",
      margin: "5px 0 0 0",
      fontSize: "18px"
    },
    buttonGroup: {
      display: "flex",
      gap: "10px",
      flexWrap: "wrap"
    },
    button: {
      backgroundColor: "#522524",
      color: "white",
      border: "none",
      padding: "10px 15px",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
      transition: "background-color 0.2s ease",
      display: "flex",
      alignItems: "center",
      gap: "5px",
      fontFamily: "AnNahar, sans-serif"
    },
    logoutButton: {
      backgroundColor: "#8B0000"
    },
    buttonHover: {
      backgroundColor: "#3a1a1a"
    },
    logoutButtonHover: {
      backgroundColor: "#600000"
    },
    statsCard: {
      backgroundColor: "#fff",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      marginBottom: "20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "15px",
      border: "2px solid #d6c6ab"
    },
    statsInfo: {
      display: "flex",
      flexDirection: "column"
    },
    statsNumber: {
      fontSize: "32px",
      fontWeight: "bold",
      color: "#522524",
      margin: "0"
    },
    statsLabel: {
      fontSize: "14px",
      color: "#7f8c8d",
      margin: "5px 0 0 0"
    },
    searchContainer: {
      display: "flex",
      alignItems: "center",
      gap: "10px"
    },
    searchInput: {
      padding: "10px 15px",
      border: "2px solid #d6c6ab",
      borderRadius: "5px",
      fontSize: "14px",
      minWidth: "250px",
      outline: "none",
      transition: "border-color 0.2s ease",
      fontFamily: "AnNahar, sans-serif",
      focus: {
        borderColor: "#522524"
      }
    },
    clearButton: {
      backgroundColor: "#95a5a6",
      color: "white",
      border: "none",
      padding: "10px 15px",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
      transition: "background-color 0.2s ease",
      fontFamily: "AnNahar, sans-serif"
    },
    clearButtonHover: {
      backgroundColor: "#7f8c8d"
    },
    loadingContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "200px",
      flexDirection: "column"
    },
    spinner: {
      border: "4px solid #f3f3f3",
      borderTop: "4px solid #522524",
      borderRadius: "50%",
      width: "40px",
      height: "40px",
      animation: "spin 1s linear infinite",
      marginBottom: "15px"
    },
    errorContainer: {
      backgroundColor: "#ffecec",
      border: "1px solid #f5aca6",
      borderRadius: "8px",
      padding: "20px",
      margin: "20px 0",
      textAlign: "center"
    },
    errorText: {
      color: "#d9534f",
      margin: "0",
      fontSize: "16px"
    },
    noResults: {
      textAlign: "center",
      padding: "40px",
      color: "#7f8c8d",
      fontSize: "16px"
    }
  };

  if (loading || adminLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>لوحة تحكم المشرف</h1>
        </div>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p>جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>لوحة تحكم المشرف</h1>
          <div style={styles.buttonGroup}>
            <button 
              style={styles.button}
              onClick={handleRefresh}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = styles.buttonHover.backgroundColor;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = styles.button.backgroundColor;
              }}
            >
              ↻ تحديث
            </button>
            <button 
              style={{...styles.button, ...styles.logoutButton}}
              onClick={handleLogout}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = styles.logoutButtonHover.backgroundColor;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = styles.logoutButton.backgroundColor;
              }}
            >
              تسجيل خروج
            </button>
          </div>
        </div>
        <div style={styles.errorContainer}>
          <p style={styles.errorText}>خطأ: {error}</p>
          <button 
            style={styles.button}
            onClick={handleRefresh}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = styles.buttonHover.backgroundColor;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = styles.button.backgroundColor;
            }}
          >
            حاول مرة أخرى
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>لوحة تحكم المشرف</h1>
          <p style={styles.welcomeText}>مرحباً، {adminName}</p>
        </div>
        <div style={styles.buttonGroup}>
          <button 
            style={styles.button}
            onClick={handleRefresh}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = styles.buttonHover.backgroundColor;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = styles.button.backgroundColor;
            }}
          >
            ↻ تحديث
          </button>
          <button 
            style={{...styles.button, ...styles.logoutButton}}
            onClick={handleLogout}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = styles.logoutButtonHover.backgroundColor;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = styles.logoutButton.backgroundColor;
            }}
          >
            تسجيل خروج
          </button>
        </div>
      </div>

      <div style={styles.statsCard}>
        <div style={styles.statsInfo}>
          <p style={styles.statsNumber}>{filteredForms.length}</p>
          <p style={styles.statsLabel}>
            {searchTerm ? "النماذج المصفاة" : "إجمالي نماذج التقديم"}
            {searchTerm && ` (بحث: ${searchTerm})`}
          </p>
        </div>
        
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="ابحث برقم الهوية..."
            value={searchTerm}
            onChange={handleSearchChange}
            style={styles.searchInput}
            onFocus={(e) => {
              e.target.style.borderColor = styles.searchInput.focus.borderColor;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#d6c6ab";
            }}
          />
          {searchTerm && (
            <button
              style={styles.clearButton}
              onClick={clearSearch}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = styles.clearButtonHover.backgroundColor;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = styles.clearButton.backgroundColor;
              }}
            >
              مسح
            </button>
          )}
        </div>
      </div>

      {filteredForms.length === 0 ? (
        <div style={styles.noResults}>
          {searchTerm ? (
            <>
              <h3>لم يتم العثور على نماذج</h3>
              <p>لا توجد نماذج تطابق رقم الهوية: {searchTerm}</p>
              <button 
                style={styles.button}
                onClick={clearSearch}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = styles.buttonHover.backgroundColor;
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = styles.button.backgroundColor;
                }}
              >
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