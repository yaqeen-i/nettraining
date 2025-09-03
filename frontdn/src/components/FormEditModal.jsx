import React, { useState, useEffect } from "react";
import formApi from "../services/formApi";
import CascadingSelects from "./CascadingSelects";

export default function FormEditModal({ form, onClose, onSave }) {
  const [formData, setFormData] = useState({ ...form });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize form data when the form prop changes
  useEffect(() => {
    setFormData({ ...form });
  }, [form]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCascadingChange = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Reset dependent fields when parent changes
      if (field === 'region') {
        newData.area = '';
        newData.institute = '';
        newData.profession = '';
      } else if (field === 'area') {
        newData.institute = '';
        newData.profession = '';
      } else if (field === 'institute') {
        newData.profession = '';
      }
      
      return newData;
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create the update payload with string names (not IDs)
      const updateData = {
        nationalID: formData.nationalID,
        phoneNumber: formData.phoneNumber,
        firstName: formData.firstName,
        fatherName: formData.fatherName,
        grandFatherName: formData.grandFatherName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        educationLevel: formData.educationLevel,
        residence: formData.residence,
        howDidYouHearAboutUs: formData.howDidYouHearAboutUs,
        region: formData.region,
        area: formData.area,
        institute: formData.institute,
        profession: formData.profession 
      };

      const { data } = await formApi.updateForm(form.id, updateData);
      onSave(data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to update form");
    } finally {
      setLoading(false);
    }
  };

  // Styling with AnNahar font and #522524 color scheme
  const styles = {
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      fontFamily: "AnNahar, sans-serif"
    },
    modalContent: {
      backgroundColor: "#f9f3e9",
      padding: "25px",
      borderRadius: "10px",
      width: "450px",
      maxHeight: "90vh",
      overflowY: "auto",
      boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
      border: "2px solid #522524"
    },
    title: {
      color: "#522524",
      textAlign: "center",
      margin: "0 0 20px 0",
      fontSize: "24px",
      fontWeight: "bold",
      borderBottom: "2px solid #522524",
      paddingBottom: "10px"
    },
    error: {
      color: "#d9534f",
      backgroundColor: "#fdf2f2",
      padding: "10px",
      borderRadius: "5px",
      border: "1px solid #ebccd1",
      marginBottom: "15px",
      textAlign: "center"
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "15px"
    },
    label: {
      textAlign: "center"
    },
    input: {
      padding: "12px 15px",
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
    select: {
      padding: "12px 15px",
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
    buttonGroup: {
      display: "flex",
      gap: "15px",
      justifyContent: "flex-end",
      marginTop: "10px"
    },
    submitButton: {
      backgroundColor: "#522524",
      color: "#fff",
      border: "none",
      padding: "12px 20px",
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
    cancelButton: {
      backgroundColor: "#d6c6ab",
      color: "#522524",
      border: "none",
      padding: "12px 20px",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "16px",
      fontFamily: "AnNahar, sans-serif",
      fontWeight: "bold",
      transition: "background-color 0.3s ease",
      hover: {
        backgroundColor: "#c4b098"
      }
    }
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <h3 style={styles.title}>تعديل النموذج</h3>
        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>الرقم الوطني</label>
          <input
            type="text"
            name="nationalID"
            placeholder="الرقم الوطني"
            value={formData.nationalID || ''}
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
          <label style={styles.label}>رقم الهاتف</label>
          <input
            type="text"
            name="phoneNumber"
            placeholder="رقم الهاتف"
            value={formData.phoneNumber || ''}
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
          <label style={styles.label}>الاسم الأول</label>
          <input
            type="text"
            name="firstName"
            placeholder="الاسم الأول"
            value={formData.firstName || ''}
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
          <label style={styles.label}>اسم الاب</label>
          <input
            type="text"
            name="fatherName"
            placeholder="اسم الأب"
            value={formData.fatherName || ''}
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
          <label style={styles.label}>اسم الجد</label>
          <input
            type="text"
            name="grandFatherName"
            placeholder="اسم الجد"
            value={formData.grandFatherName || ''}
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
          <label style={styles.label}>اسم العائلة</label>
          <input
            type="text"
            name="lastName"
            placeholder="اسم العائلة"
            value={formData.lastName || ''}
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
          <label style={styles.label}>الجنس</label>
          
          <select
            name="gender"
            value={formData.gender || ''}
            onChange={handleChange}
            required
            style={styles.select}
            onFocus={(e) => {
              e.target.style.borderColor = styles.select.focus.borderColor;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#d6c6ab";
            }}
          >   
            <option value="">اختر الجنس</option>
            <option value="MALE">ذكر</option>
            <option value="FEMALE">أنثى</option>
          </select>
          <label style={styles.label}>الاقليم - المنطقة - المعهد - الحرفة</label>
  
          <CascadingSelects
            selectedRegion={formData.region}   
            selectedArea={formData.area}               
            selectedInstitute={formData.institute}     
            selectedProfession={formData.profession}   
            gender={formData.gender}
            onSelectionChange={handleCascadingChange}  
          />
          <label style={styles.label}>مكان السكن</label>
          <input 
            type="text"
            name="residence"
            placeholder="مكان السكن"
            value={formData.residence || ''}
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
          <label style={styles.label}>تاريخ الميلاد</label>
          <input 
            type="date"
            name="dateOfBirth"
            placeholder="تاريخ الميلاد"
            value={formData.dateOfBirth || ''}
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
          <label style={styles.label}>المستوى التعليمي</label>
          
          <select
            name="educationLevel"
            value={formData.educationLevel || ''}
            onChange={handleChange}
            required
            style={styles.select}
            onFocus={(e) => {
              e.target.style.borderColor = styles.select.focus.borderColor;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#d6c6ab";
            }}
          >   
            <option value="">اختر المستوى التعليمي</option>
            <option value="HIGH_SCHOOL">ثانوية عامة</option>
            <option value="MIDDLE_SCHOOL">إعدادية</option>
            <option value="DIPLOMA">دبلوم</option>
            <option value="BACHELOR">بكالوريوس</option>
            <option value="MASTER">ماجستير</option>
          </select>
          <label style={styles.label}>كيف سمعت عنا؟</label>
          
          <select
            name="howDidYouHearAboutUs"
            value={formData.howDidYouHearAboutUs || ''}
            onChange={handleChange}
            required
            style={styles.select}
            onFocus={(e) => {
              e.target.style.borderColor = styles.select.focus.borderColor;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#d6c6ab";
            }}
          >   
            <option value="">كيف سمعت عنا؟</option>
            <option value="SOCIAL_MEDIA">وسائل التواصل الاجتماعي</option>
            <option value="RELATIVE">قريب</option>
            <option value="GOOGLE_SEARCH">بحث جوجل</option>
          </select>

          <div style={styles.buttonGroup}>
            <button 
              type="submit" 
              disabled={loading}
              style={{
                ...styles.submitButton,
                ...(loading ? styles.submitButton.disabled : {})
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = styles.submitButton.hover.backgroundColor;
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = styles.submitButton.backgroundColor;
                }
              }}
            >
              {loading ? "جاري الحفظ..." : "حفظ"}
            </button>
            <button 
              type="button" 
              onClick={onClose}
              style={styles.cancelButton}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = styles.cancelButton.hover.backgroundColor;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = styles.cancelButton.backgroundColor;
              }}
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}