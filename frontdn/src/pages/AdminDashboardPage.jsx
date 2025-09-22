import React, { useEffect, useState , useRef} from "react";
import formApi from "../services/formApi";
import adminApi from "../services/adminApi";
import FormTable from "../components/FormTable";
import { jwtDecode } from "jwt-decode"; 
import * as XLSX from "xlsx";
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
  const [importLoading, setImportLoading] = useState(false);
  const [importError, setImportError] = useState(null);
  const [importSuccess, setImportSuccess] = useState(null);
  const fileInputRef = useRef(null);


  useEffect(() => {
    
    const fetchAdminDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          // Decode the token to get admin ID
          const decoded = jwtDecode(token);
          const adminId = decoded.id;
          
          // Fetch admin details using the ID
          const response = await adminApi.getAdminById(adminId);
          setAdminName(response.data.username); 
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
    setSearchTerm(""); 
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

  
  const exportToCSV = () => {
    if (filteredForms.length === 0) {
      alert("لا توجد بيانات للتصدير");
      return;
    }

    // define CSV headers
    const headers = [
      "National ID",
      "Gender",
      "First Name",
      "Father Name",
      "Grandfather Name",
      "Last Name",
      "Phone Number",
      "Education Level",
      "Date of Birth",
      "Region",
      "Area",
      "Institute",
      "Residence",
      "Profession",
      "Status",
      "Marks",
      "How did he hear about us?"
    ];

    // convert data to CSV format
    const csvData = filteredForms.map(form => {
      return [
        form.nationalID || "",
        form.gender || "",
        form.firstName || "",
        form.fatherName || "",
        form.grandFatherName || "",
        form.lastName || "",
        form.phoneNumber || "",
        form.educationLevel || "",
        form.dateOfBirth ? new Date(form.dateOfBirth).toLocaleDateString("en-GB") : "",
        form.region || "",
        form.area || "",
        form.institute || "",
        form.residence || "",
        form.profession || "",
        form.status || "PENDING",
        form.mark || "",
        form.howDidYouHearAboutUs || ""
      ];
    });

    // combine headers and data
    const csvContent = [headers, ...csvData]
      .map(sheet => sheet.map(field => `"${field}"`).join(","))
      .join("\n");

    // for download link creation download link
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `applicants_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  const handleFileUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setImportLoading(true);
  setImportError(null);
  setImportSuccess(null);

  try {
    // Read the Excel file
    const data = await readExcelFile(file);
    console.log("Imported data:", data);
    
    // Map Excel column names to database field names
    const mappedData = data.map(sheet => {
      return {
        nationalID: sheet['National ID'] ,
        phoneNumber: sheet['Phone Number'] ,
        firstName: sheet['First Name'] ,
        fatherName: sheet['Father Name'] ,
        grandFatherName: sheet['Grandfather Name'] ,
        lastName: sheet['Last Name'],
        dateOfBirth: convertExcelDate(sheet['Date of Birth']),
        gender: sheet['Gender'] ,
        educationLevel: sheet['Education Level'],
        residence: sheet['Residence'],
        howDidYouHearAboutUs: sheet['How did he hear about us?'],
        region: sheet['Region'] ,
        area: sheet['Area'],
        institute: sheet['Institute'],
        profession: sheet['Profession'] ,
        status: sheet['Status'] ,
        mark: sheet['Mark'] ,
      };
    });
    
    console.log("Mapped data:", mappedData);
    
    // send mapped data to the server api
    const response = await formApi.importForms(mappedData);
    console.log("Import response:", response);
    
    if (response.data.count === 0 && response.data.errors.length > 0) {
      // log
      const firstError = response.data.errors[0];
      setImportError(`فشل في استيراد البيانات: ${firstError.error}`);
    } else {
      // success message
      setImportSuccess(`تم استيراد ${response.data.count} سجل بنجاح مع ${response.data.errors.length} أخطاء`);
    }
    
    
    handleRefresh();
  } catch (err) {
    console.error("Error importing file:", err);
    setImportError(err.response?.data?.error || "فشل في استيراد الملف");
  } finally {
    setImportLoading(false);
  
    e.target.value = "";
  }
};

const convertExcelDate = (excelDate) => {
  if (!excelDate) return null;
  
  // If it's already a proper date string, return it
  if (typeof excelDate === 'string' && excelDate.includes('-')) {
    return excelDate;
  }
  
  // If it's an Excel serial date number, convert it
  if (typeof excelDate === 'number') {
    const date = new Date((excelDate - 25569) * 86400 * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  // If it's a Date object, then format it
  if (excelDate instanceof Date) {
    return excelDate.toISOString().split('T')[0];
  }
  
  return null;
};

  const readExcelFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Get the first worksheet
          const worksheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[worksheetName];
          
          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  const validateImportedData = (data) => {
  if (!data || data.length === 0) {
    console.log("No data found in file");
    return false;
  }
  
  // Check if the first sheet has the expected columns
  const firstsheet = data[0];
  console.log("First sheet of imported data:", firstsheet);
  
  const expectedColumns = [
      'National ID', 'Gender', 'First Name', 'Father Name', 
      'Grandfather Name', 'Last Name', 'Phone Number', 'Date Of Birth',
      'Region', 'Area', 'Institute', 'Profession', 'Status', 'Marks',
      'How did he hear about us?'
    ];
  
  // Check for required fields
  const missingColumns = expectedColumns.filter(column => !firstsheet.hasOwnProperty(column));
  
  if (missingColumns.length > 0) {
    console.log("Missing columns in imported data:", missingColumns);
    return false;
  }
  
  return true;
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
          <button className="button exportButton" onClick={exportToCSV}>
             تصدير إلى Excel
          </button>
          <button 
            className="button importButton" 
            onClick={handleImportClick}
            disabled={importLoading}
          >
            {importLoading ? "جاري الاستيراد..." : "📥 استيراد من Excel"}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".xlsx, .xls, .csv"
            style={{ display: 'none' }}
          />
          <button
            className="button logoutButton"
            onClick={handleLogout}
          >
            تسجيل خروج
          </button>
        </div>
      </div>

      {importError && (
        <div className="importError">
          <p>{importError}</p>
        </div>
      )}
      {importSuccess && (
        <div className="importSuccess">
          <p>{importSuccess}</p>
        </div>
      )}


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