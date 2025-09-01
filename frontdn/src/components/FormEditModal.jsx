import React, { useState, useEffect } from "react";
import formApi from "../services/formApi";
import CascadingSelects from "./CascadingSelects";

export default function FormEditModal({ form, onClose, onSave }) {
  const [formData, setFormData] = useState({ ...form });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // Initialize form data with proper IDs
  useEffect(() => {
    const initializeFormData = async () => {
      try {
        setInitializing(true);
        
        // If the form has region, area, institute, profession as names (not IDs), 
        // we need to find their corresponding IDs
        if (form.region && typeof form.regionId === 'undefined') {
          // Get all regions to find the ID for the current region name
          const regionsResponse = await formApi.getRegions();
          const region = regionsResponse.data.find(r => r.name === form.region);
          if (region) {
            setFormData(prev => ({ ...prev, regionId: region.id }));
            
            // Get areas for this region
            const areasResponse = await formApi.getAreas(region.id);
            const area = areasResponse.data.find(a => a.name === form.area);
            if (area) {
              setFormData(prev => ({ ...prev, areaId: area.id }));
              
              // Get institutes for this area
              const institutesResponse = await formApi.getInstitutes(area.id);
              const institute = institutesResponse.data.find(i => i.name === form.institue); // Note: 'institue' typo in your model
              if (institute) {
                setFormData(prev => ({ ...prev, instituteId: institute.id }));
                
                // Get professions for this institute and gender
                if (form.gender) {
                  const professionsResponse = await formApi.getProfessions(institute.id, form.gender);
                  const profession = professionsResponse.data.find(p => p.name === form.profession);
                  if (profession) {
                    setFormData(prev => ({ ...prev, professionId: profession.id }));
                  }
                }
              }
            }
          }
        }
      } catch (error) {
        console.error("Error initializing form data:", error);
        setError("Failed to load form data");
      } finally {
        setInitializing(false);
      }
    };

    initializeFormData();
  }, [form]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCascadingChange = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Reset dependent fields when parent changes
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

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create the update payload with IDs
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
        regionId: formData.regionId,
        areaId: formData.areaId,
        instituteId: formData.instituteId,
        professionId: formData.professionId
      };

      const { data } = await formApi.updateForm(form.id, updateData);
      onSave(data);
      window.location.reload(); 
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to update form");
    } finally {
      setLoading(false);
    }
  };

  if (initializing) {
    return (
      <div style={modalOverlayStyle}>
        <div style={modalContentStyle}>
          <h3>Loading Form Data...</h3>
        </div>
      </div>
    );
  }

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <h3>Edit Form</h3>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <input
            type="text"
            name="nationalID"
            placeholder="National ID"
            value={formData.nationalID || ''}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber || ''}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName || ''}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="fatherName"
            placeholder="Father Name"
            value={formData.fatherName || ''}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="grandFatherName"
            placeholder="Grandfather Name"
            value={formData.grandFatherName || ''}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName || ''}
            onChange={handleChange}
            required
          />
          
          <select
            name="gender"
            value={formData.gender || ''}
            onChange={handleChange}
            required
          >   
            <option value="">Select Gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>

          <CascadingSelects
            selectedRegionId={formData.regionId}
            selectedAreaId={formData.areaId}
            selectedInstituteId={formData.instituteId}
            selectedProfessionId={formData.professionId}
            gender={formData.gender}
            onSelectionChange={handleCascadingChange}
          />

          <input 
            type="text"
            name="residence"
            placeholder="Residence"
            value={formData.residence || ''}
            onChange={handleChange}
            required
          />
          
          <input 
            type="date"
            name="dateOfBirth"
            placeholder="Date Of Birth"
            value={formData.dateOfBirth || ''}
            onChange={handleChange}
            required
          />
          
          <select
            name="educationLevel"
            value={formData.educationLevel || ''}
            onChange={handleChange}
            required
          >   
            <option value="">Select Education Level</option>
            <option value="HIGH_SCHOOL">High School</option>
            <option value="MIDDLE_SCHOOL">Middle School</option>
            <option value="DIPLOMA">Diploma</option>
            <option value="BACHELOR">Bachelor</option>
            <option value="MASTER">Master</option>
          </select>
          
          <select
            name="howDidYouHearAboutUs"
            value={formData.howDidYouHearAboutUs || ''}
            onChange={handleChange}
            required
          >   
            <option value="">How did you hear about us?</option>
            <option value="SOCIAL_MEDIA">Social Media</option>
            <option value="RELATIVE">Relative</option>
            <option value="GOOGLE_SEARCH">Google Search</option>
          </select>

          <div style={{ display: "flex", gap: "10px" }}>
            <button type="submit" disabled={loading || initializing}>
              {loading ? "Saving..." : "Save"}
            </button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Modal styling stays the same
const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000
};

const modalContentStyle = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "8px",
  width: "400px",
  maxHeight: "90%",
  overflowY: "auto",
  boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
};