import React, { useEffect, useState , useRef} from "react";
import formApi from "../services/formApi";
import adminApi from "../services/adminApi";
import FormTable from "../components/FormTable";
import FloatingAIChat from "../components/floatingChat";
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
  const [regionFilter, setRegionFilter] = useState("");
  const [areaFilter, setAreaFilter] = useState("");
  const [instituteFilter, setInstituteFilter] = useState("");
  const [professionFilter, setProfessionFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Available options for cascading filters
  const [regions, setRegions] = useState([]);
  const [areas, setAreas] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [professions, setProfessions] = useState([]);
  const [filterLoading, setFilterLoading] = useState(false);

  // Get unique statuses from current data
  const uniqueStatuses = [...new Set(forms.map(form => form.status || 'PENDING'))].filter(Boolean).sort();

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

  // Fetch regions for filters
  useEffect(() => {
    const fetchRegions = async () => {
      setFilterLoading(true);
      try {
        const response = await formApi.getRegions();
        setRegions(response.data);
      } catch (error) {
        console.error("Error fetching regions:", error);
      } finally {
        setFilterLoading(false);
      }
    };
    fetchRegions();
  }, []);

  // Fetch areas when region changes
  useEffect(() => {
    if (regionFilter) {
      const fetchAreas = async () => {
        setFilterLoading(true);
        try {
          const response = await formApi.getAreas(regionFilter);
          setAreas(response.data);
          // Reset dependent filters
          setAreaFilter("");
          setInstituteFilter("");
          setProfessionFilter("");
        } catch (error) {
          console.error("Error fetching areas:", error);
        } finally {
          setFilterLoading(false);
        }
      };
      fetchAreas();
    } else {
      setAreas([]);
      setAreaFilter("");
      setInstituteFilter("");
      setProfessionFilter("");
    }
  }, [regionFilter]);

  // Fetch institutes when area changes
  useEffect(() => {
    if (areaFilter && regionFilter) {
      const fetchInstitutes = async () => {
        setFilterLoading(true);
        try {
          const response = await formApi.getInstitutes(regionFilter, areaFilter);
          setInstitutes(response.data);
          // Reset dependent filters
          setInstituteFilter("");
          setProfessionFilter("");
        } catch (error) {
          console.error("Error fetching institutes:", error);
        } finally {
          setFilterLoading(false);
        }
      };
      fetchInstitutes();
    } else {
      setInstitutes([]);
      setInstituteFilter("");
      setProfessionFilter("");
    }
  }, [areaFilter, regionFilter]);

  // Fetch professions when institute changes
  useEffect(() => {
    if (instituteFilter && areaFilter && regionFilter) {
      const fetchProfessions = async () => {
        setFilterLoading(true);
        try {
          const response = await formApi.getProfessions(regionFilter, areaFilter, instituteFilter, "MALE"); // Gender not needed for filter
          setProfessions(response.data);
          setProfessionFilter("");
        } catch (error) {
          console.error("Error fetching professions:", error);
        } finally {
          setFilterLoading(false);
        }
      };
      fetchProfessions();
    } else {
      setProfessions([]);
      setProfessionFilter("");
    }
  }, [instituteFilter, areaFilter, regionFilter]);

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

  useEffect(() => {
    applyFilters();
  }, [regionFilter, areaFilter, professionFilter, statusFilter, searchTerm, forms]);

  const applyFilters = () => {
    let filtered = forms;

    // Apply search filter
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(form =>
        form.nationalID && form.nationalID.includes(searchTerm.trim())
      );
    }

    // Apply region filter
    if (regionFilter) {
      filtered = filtered.filter(form => form.region === regionFilter);
    }

    // Apply area filter
    if (areaFilter) {
      filtered = filtered.filter(form => form.area === areaFilter);
    }

    // Apply profession filter
    if (professionFilter) {
      filtered = filtered.filter(form => form.profession === professionFilter);
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(form => (form.status || 'PENDING') === statusFilter);
    }

    setFilteredForms(filtered);
  };

  const handleEdit = updatedForm => {
    const updatedForms = forms.map(f => (f.id === updatedForm.id ? updatedForm : f));
    setForms(updatedForms);
    
    // Also update filtered forms if the edited form is in the current filtered view
    if (searchTerm.trim() === "" || updatedForm.nationalID.includes(searchTerm.trim())) {
      const updatedFiltered = filteredForms.map(f => (f.id === updatedForm.id ? updatedForm : f));
      setFilteredForms(updatedFiltered);
    }
  };

  // Add this function to your AdminDashboardPage component
const handleDelete = async (formId) => {
  try {
    await formApi.deleteForm(formId);
    
    // Remove the deleted form from state
    const updatedForms = forms.filter(form => form.id !== formId);
    setForms(updatedForms);
    
    // Also update filtered forms
    const updatedFilteredForms = filteredForms.filter(form => form.id !== formId);
    setFilteredForms(updatedFilteredForms);
    
    // Show success message
    setImportSuccess('تم حذف النموذج بنجاح');
  } catch (error) {
    console.error('Error deleting form:', error);
    setImportError(error.response?.data?.error || 'فشل في حذف النموذج');
  }
};

  const clearFilters = () => {
    setSearchTerm("");
    setRegionFilter("");
    setAreaFilter("");
    setProfessionFilter("");
    setStatusFilter("");
  };

  // Update the FormTable component usage
<FormTable forms={filteredForms} onEdit={handleEdit} onDelete={handleDelete} />

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

  
  const exportToExcel = () => {
  if (!filteredForms || filteredForms.length === 0) {
    alert("لا توجد بيانات للتصدير");
    return;
  }

  // map forms to match table column order
  const exportData = filteredForms.map(form => ({
    "National ID": form.nationalID ? String(form.nationalID) : "",
    "Gender": form.gender ,
    "Last Name": form.lastName ,
    "Grandfather Name": form.grandFatherName,
    "Father Name": form.fatherName ,
    "First Name": form.firstName,
    "Phone Number": form.phoneNumber ? String(form.phoneNumber) : "",
    "Education Level": form.educationLevel ,
    "Date of Birth": form.dateOfBirth ? new Date(form.dateOfBirth).toISOString().split("T")[0] : "",
    "Region": form.region ,
    "Area": form.area || "No cell present-log statement",
    "Institute": form.institute ,
    "Residence": form.residence ,
    "Profession": form.profession ,
    "Status": form.status || "PENDING",
    "Marks": form.mark ,
    "Required Documents": form.requiredDocuments,
    "How did he hear about us?": form.howDidYouHearAboutUs
  }));

  // create worksheet and workbook to export
  const worksheet = XLSX.utils.json_to_sheet(exportData, { cellDates: true });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Applicants");

  /* set phone numbers and IDs as text so there won't be no problems with
   importing the same excel files back like phone numbers losing leading zeros due 
   default number format in excel for plain numbers - same goes for the nationalID
  */
  exportData.forEach((_, i) => {
    ["A", "G"].forEach(col => { // A = National ID, A: is national id column in the excel file
    // G = Phone Number, G: is phone number column in the excel file
      const cell = worksheet[`${col}${i + 2}`]; // +2 because headers occupy row 1
      if (cell) cell.z = "@"; // excel text format
    });
  });

  // Save file
  XLSX.writeFile(workbook, `applicants_${new Date().toISOString().split("T")[0]}.xlsx`);
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
      'Region', 'Area', 'Institute', 'Profession', 'Status', 'Marks', 'Required Documents',
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
          <button className="button exportButton" onClick={exportToExcel}>
             تصدير إلى Excel
          </button>
          <button 
            className="button importButton" 
            onClick={handleImportClick}
            disabled={importLoading}
          >
            {importLoading ? "جاري الاستيراد..." : " استيراد من Excel"}
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
            {filteredForms.length !== forms.length ? "النماذج المصفاة" : "إجمالي نماذج التقديم"}
            {(regionFilter || areaFilter || professionFilter || statusFilter || searchTerm) && 
              ` (مطبق ${[
                searchTerm && 'بحث',
                regionFilter && 'إقليم',
                areaFilter && 'منطقة', 
                professionFilter && 'حرفة',
                statusFilter && 'حالة'
              ].filter(Boolean).join('، ')})`
            }
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

      {/* Cascading Filters Section */}
      <div className="filters-section">
        <h3>تصفية النتائج</h3>
        <div className="filters-grid cascading-filters">
          <div className="filter-group">
            <label>الإقليم:</label>
            <select 
              value={regionFilter} 
              onChange={(e) => setRegionFilter(e.target.value)}
              disabled={filterLoading}
              className="select"
            >
              <option value="">جميع الأقاليم</option>
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>المنطقة:</label>
            <select 
              value={areaFilter} 
              onChange={(e) => setAreaFilter(e.target.value)}
              disabled={!regionFilter || filterLoading}
              className="select"
            >
              <option value="">جميع المناطق</option>
              {areas.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>المعهد:</label>
            <select 
              value={instituteFilter} 
              onChange={(e) => setInstituteFilter(e.target.value)}
              disabled={!areaFilter || filterLoading}
              className="select"
            >
              <option value="">جميع المعاهد</option>
              {institutes.map(institute => (
                <option key={institute} value={institute}>{institute}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>الحرفة:</label>
            <select 
              value={professionFilter} 
              onChange={(e) => setProfessionFilter(e.target.value)}
              disabled={!instituteFilter || filterLoading}
              className="select"
            >
              <option value="">جميع الحرف</option>
              {professions.map(profession => (
                <option key={profession} value={profession}>{profession}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>الحالة:</label>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="select"
            >
              <option value="">جميع الحالات</option>
              {uniqueStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div className="filter-actions">
            <button className="button clear-filters-button" onClick={clearFilters}>
              مسح جميع الفلاتر
            </button>
          </div>
        </div>
      </div>

      {filteredForms.length === 0 ? (
        <div className="noResults">
          {searchTerm || regionFilter || areaFilter || instituteFilter || professionFilter || statusFilter ? (
            <>
              <h3>لم يتم العثور على نماذج</h3>
              <p>لا توجد نماذج تطابق معايير البحث والتصفية المحددة</p>
              <button className="button" onClick={clearFilters}>
                عرض جميع النماذج
              </button>
            </>
          ) : (
            <h3>لا توجد نماذج متاحة</h3>
          )}
        </div>
      ) : (
        <FormTable forms={filteredForms} onEdit={handleEdit} onDelete={handleDelete} />
      )}{
         <FloatingAIChat />
      }
    </div>
  );
}