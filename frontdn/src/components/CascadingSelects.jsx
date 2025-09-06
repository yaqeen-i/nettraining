import React, { useState, useEffect } from "react";
import formApi from "../services/formApi";

export default function CascadingSelects({ 
  selectedRegion, 
  selectedArea, 
  selectedInstitute, 
  selectedProfession,
  gender,
  onSelectionChange 
}) {
  const [regions, setRegions] = useState([]);
  const [areas, setAreas] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [professions, setProfessions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Styling with AnNahar font and #522524 color scheme
  const styles = {
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
      width: "100%",
      marginBottom: "10px",
      focus: {
        borderColor: "#522524"
      },
      disabled: {
        backgroundColor: "#f5f5f5",
        color: "#999",
        cursor: "not-allowed"
      }
    }
  };

  // Fetch regions on mount
  useEffect(() => {
    const fetchRegions = async () => {
      setLoading(true);
      try {
        const response = await formApi.getRegions();
        setRegions(response.data);
      } catch (error) {
        console.error("Error fetching regions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRegions();
  }, []);

  // Fetch areas when region changes
  useEffect(() => {
    if (selectedRegion) {
      const fetchAreas = async () => {
        setLoading(true);
        try {
          const response = await formApi.getAreas(selectedRegion);
          setAreas(response.data);
        } catch (error) {
          console.error("Error fetching areas:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchAreas();
    } else {
      setAreas([]);
      setInstitutes([]);
      setProfessions([]);
    }
  }, [selectedRegion]);

  // Fetch institutes when area changes
  useEffect(() => {
    if (selectedArea && selectedRegion) {
      const fetchInstitutes = async () => {
        setLoading(true);
        try {
          const response = await formApi.getInstitutes(selectedRegion, selectedArea);
          setInstitutes(response.data);
        } catch (error) {
          console.error("Error fetching institutes:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchInstitutes();
    } else {
      setInstitutes([]);
      setProfessions([]);
    }
  }, [selectedArea, selectedRegion]);

  // Fetch professions when institute or gender changes
  useEffect(() => {
    if (selectedInstitute && selectedArea && selectedRegion && gender) {
      const fetchProfessions = async () => {
        setLoading(true);
        try {
          const response = await formApi.getProfessions(selectedRegion, selectedArea, selectedInstitute, gender);
          setProfessions(response.data);
        } catch (error) {
          console.error("Error fetching professions:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProfessions();
    } else {
      setProfessions([]);
    }
  }, [selectedInstitute, selectedArea, selectedRegion, gender]);

  return (
    <>
      <select 
        name="region"
        value={selectedRegion || ''}
        onChange={(e) => onSelectionChange('region', e.target.value)}
        required
        disabled={loading}
        style={{
          ...styles.select,
          ...(loading ? styles.select.disabled : {}),
        }}
        onFocus={(e) => {
          e.target.style.borderColor = styles.select.focus.borderColor;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#d6c6ab";
        }}
      >
        <option value="">اختر الاقليم</option>
        {regions.map(region => (
          <option key={region} value={region}>{region}</option>
        ))}
      </select>

      <select 
        name="area"
        value={selectedArea || ''}
        onChange={(e) => onSelectionChange('area', e.target.value)}
        disabled={!selectedRegion || loading}
        required
        style={{
          ...styles.select,
          ...((!selectedRegion || loading) ? styles.select.disabled : {}),
        }}
        onFocus={(e) => {
          e.target.style.borderColor = styles.select.focus.borderColor;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#d6c6ab";
        }}
      >
        <option value="">اختر المنطقة</option>
        {areas.map(area => (
          <option key={area} value={area}>{area}</option>
        ))}
      </select>

      <select 
        name="institute"
        value={selectedInstitute || ''}
        onChange={(e) => onSelectionChange('institute', e.target.value)}
        disabled={!selectedArea || loading}
        required
        style={{
          ...styles.select,
          ...((!selectedArea || loading) ? styles.select.disabled : {}),
        }}
        onFocus={(e) => {
          e.target.style.borderColor = styles.select.focus.borderColor;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#d6c6ab";
        }}
      >
        <option value="">اختر المعهد</option>
        {institutes.map(institute => (
          <option key={institute} value={institute}>{institute}</option>
        ))}
      </select>

      <select 
        name="profession"
        value={selectedProfession || ''}
        onChange={(e) => onSelectionChange('profession', e.target.value)}
        disabled={!selectedInstitute || !gender || loading}
        required
        style={{
          ...styles.select,
          ...((!selectedInstitute || !gender || loading) ? styles.select.disabled : {}),
        }}
        onFocus={(e) => {
          e.target.style.borderColor = styles.select.focus.borderColor;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#d6c6ab";
        }}
      >
        <option value="">اختر التخصص</option>
        {professions.map(profession => (
          <option key={profession} value={profession}>{profession}</option>
        ))}
      </select>
    </>
  );
}