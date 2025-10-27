import React, { useState, useEffect } from "react";
import formApi from "../services/formApi";
import CascadingSelects from "./CascadingSelects";
import "../styles/FormEditModal.css";

export default function FormEditModal({ form, onClose, onSave }) {
  const [formData, setFormData] = useState({ ...form });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setFormData({ ...form });
  }, [form]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCascadingChange = (field, value) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      if (field === "region") {
        newData.area = "";
        newData.institute = "";
        newData.profession = "";
      } else if (field === "area") {
        newData.institute = "";
        newData.profession = "";
      } else if (field === "institute") {
        newData.profession = "";
      }
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const updateData = {
        nationalID: formData.nationalID,
        gender: formData.gender,
        lastName: formData.lastName,
        grandFatherName: formData.grandFatherName,
        fatherName: formData.fatherName,
        firstName: formData.firstName,
        phoneNumber: formData.phoneNumber,
        educationLevel: formData.educationLevel,
        dateOfBirth: formData.dateOfBirth,
        region: formData.region,
        area: formData.area,
        institute: formData.institute,
        profession: formData.profession,
        residence: formData.residence,
        status: formData.status,
        mark: formData.mark,
        requiredDocuments: formData.requiredDocuments,
        howDidYouHearAboutUs: formData.howDidYouHearAboutUs,
      };

      const { data } = await formApi.updateForm(form.id, updateData);
      onSave(data);
      window.location.reload();
    } catch (err) {
      console.error("Error updating form:", err);
      setError(err.response?.data?.error || "Failed to update form");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="modal-title">تعديل النموذج</h3>
        {error && <p className="modal-error">{error}</p>}

        <form onSubmit={handleSubmit} className="modal-form">
          <label>الرقم الوطني</label>
          <input
            type="text"
            name="nationalID"
            placeholder="الرقم الوطني"
            value={formData.nationalID || ""}
            onChange={handleChange}
            required
            className="modal-input"
          />

          <label>رقم الهاتف</label>
          <input
            type="text"
            name="phoneNumber"
            placeholder="رقم الهاتف"
            value={formData.phoneNumber || ""}
            onChange={handleChange}
            required
            className="modal-input"
          />

          <label>الاسم الأول</label>
          <input
            type="text"
            name="firstName"
            placeholder="الاسم الأول"
            value={formData.firstName || ""}
            onChange={handleChange}
            required
            className="modal-input"
          />

          <label>اسم الاب</label>
          <input
            type="text"
            name="fatherName"
            placeholder="اسم الأب"
            value={formData.fatherName || ""}
            onChange={handleChange}
            required
            className="modal-input"
          />

          <label>اسم الجد</label>
          <input
            type="text"
            name="grandFatherName"
            placeholder="اسم الجد"
            value={formData.grandFatherName || ""}
            onChange={handleChange}
            required
            className="modal-input"
          />

          <label>اسم العائلة</label>
          <input
            type="text"
            name="lastName"
            placeholder="اسم العائلة"
            value={formData.lastName || ""}
            onChange={handleChange}
            required
            className="modal-input"
          />

          <label>الجنس</label>
          <select
            name="gender"
            value={formData.gender || ""}
            onChange={handleChange}
            required
            className="modal-select"
          >
            <option value="">اختر الجنس</option>
            <option value="MALE">ذكر</option>
            <option value="FEMALE">أنثى</option>
          </select>

          <label>الاقليم - المنطقة - المعهد - الحرفة</label>
          <CascadingSelects
            selectedRegion={formData.region}
            selectedArea={formData.area}
            selectedInstitute={formData.institute}
            selectedProfession={formData.profession}
            gender={formData.gender}
            onSelectionChange={handleCascadingChange}
          />

          <label>مكان السكن</label>
          <input
            type="text"
            name="residence"
            placeholder="مكان السكن"
            value={formData.residence || ""}
            onChange={handleChange}
            required
            className="modal-input"
          />

          <label>تاريخ الميلاد</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth || ""}
            onChange={handleChange}
            required
            className="modal-input"
          />

          <label>المستوى التعليمي</label>
          <select
            name="educationLevel"
            value={formData.educationLevel || ""}
            onChange={handleChange}
            required
            className="modal-select"
          >
            <option value="">اختر المستوى التعليمي</option>
            <option value="HIGH_SCHOOL">ثانوية عامة</option>
            <option value="MIDDLE_SCHOOL">إعدادية</option>
            <option value="DIPLOMA">دبلوم</option>
            <option value="BACHELOR">بكالوريوس</option>
            <option value="MASTER">ماجستير</option>
          </select>

          <label>الحالة</label>
            <select
              name="status"
              value={formData.status || "PENDING"}
              onChange={handleChange}
              className="modal-select"
            >
              <option value="PENDING">Pending - الخطوة الاولى (في الانتظار)</option>
              <option value="PHONE_CALL">Phone Call</option>
              <option value="PASSED_THE_EXAM">Passed the Exam </option>
              <option value="WAITING_FOR_DOCUMENTS">Waiting For Documents</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="REJECTED">Rejected</option>
            </select>

            <label>العلامة (0-100):</label>
            <input
              type="number"
              name="mark"
              min="0"
              max="100"
              value={formData.mark || ""}
              onChange={handleChange}
              placeholder="Enter mark"
              className="modal-input"
            />

          <label> هل تم تسليم الملفات الخاصة بالطالب؟</label>
          <select 
            name="requiredDocuments" 
            value={formData.requiredDocuments}
            onChange={handleChange}
            className="modal-select"
            >
              <option value="YES"> YES / نعم </option>
              <option value="NO"> NO / لا </option>
              {/* there should be an endpoint and also an interface where the student can upload the required documents
  should be implemented where the documents can be stored in a cloud storage like AWS S3 
 */}
          </select>
            
          <label>كيف سمعت عنا؟</label>
          <select
            name="howDidYouHearAboutUs"
            value={formData.howDidYouHearAboutUs || ""}
            onChange={handleChange}
            required
            className="modal-select"
          >
            <option value="">كيف سمعت عنا؟</option>
            <option value="SOCIAL_MEDIA">وسائل التواصل الاجتماعي</option>
            <option value="RELATIVE">قريب</option>
            <option value="GOOGLE_SEARCH">بحث جوجل</option>
          </select>

          <div className="modal-buttons">
            <button
              type="submit"
              disabled={loading}
              className="modal-submit-button"
            >
              {loading ? "جاري الحفظ..." : "حفظ"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="modal-cancel-button"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
