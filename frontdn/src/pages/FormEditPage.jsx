import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import formApi from "../services/formApi";
import CascadingSelects from "../components/CascadingSelects";

export default function FormEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nationalID: "",
    phoneNumber: "",
    firstName: "",
    fatherName: "",
    grandFatherName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    educationLevel: "",
    residence: "",
    howDidYouHearAboutUs: "",
    regionId: "",
    areaId: "",
    instituteId: "",
    professionId: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    formApi.getFormById(id)
      .then((res) => {
        setFormData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch form:", err);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCascadingChange = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      if (field === 'regionId') {
        newData.areaId = '';
        newData.instituteId = '';
        newData.professionId = '';
      } else if (field === 'areaId') {
        newData.instituteId = '';
        newData.professionId = '';
      } else if (field === 'instituteId') {
        newData.professionId = '';
      }
      
      return newData;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    formApi.updateForm(id, formData)
      .then(() => {
        alert("Form updated successfully!");
        navigate("/dashboard");
      })
      .catch((err) => console.error("Update failed:", err));
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Edit Form</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Personal Information */}
        <input
          type="text"
          name="nationalID"
          placeholder="National ID"
          value={formData.nationalID}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        >
          <option value="">Select Gender</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
        </select>

        {/* Cascading Selects */}
        <CascadingSelects
          selectedRegionId={formData.regionId}
          selectedAreaId={formData.areaId}
          selectedInstituteId={formData.instituteId}
          selectedProfessionId={formData.professionId}
          gender={formData.gender}
          onSelectionChange={handleCascadingChange}
        />

        {/* Other fields */}
        {/* Add other form fields as needed */}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Form
        </button>
      </form>
    </div>
  );
}