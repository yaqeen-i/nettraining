import React, { useState, useEffect } from "react";
import formApi from "../services/formApi";

export default function CascadingSelects({ 
  selectedRegionId, 
  selectedAreaId, 
  selectedInstituteId, 
  selectedProfessionId,
  gender,
  onSelectionChange 
}) {
  const [regions, setRegions] = useState([]);
  const [areas, setAreas] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [professions, setProfessions] = useState([]);
  const [loading, setLoading] = useState({
    regions: false,
    areas: false,
    institutes: false,
    professions: false
  });

  // Fetch regions on mount
  useEffect(() => {
    const fetchRegions = async () => {
      setLoading(prev => ({ ...prev, regions: true }));
      try {
        const response = await formApi.getRegions();
        setRegions(response.data);
      } catch (error) {
        console.error("Error fetching regions:", error);
      } finally {
        setLoading(prev => ({ ...prev, regions: false }));
      }
    };
    fetchRegions();
  }, []);

  // Fetch areas when region changes
  useEffect(() => {
    if (selectedRegionId) {
      const fetchAreas = async () => {
        setLoading(prev => ({ ...prev, areas: true }));
        try {
          const response = await formApi.getAreas(selectedRegionId);
          setAreas(response.data);
        } catch (error) {
          console.error("Error fetching areas:", error);
        } finally {
          setLoading(prev => ({ ...prev, areas: false }));
        }
      };
      fetchAreas();
    } else {
      setAreas([]);
      setInstitutes([]);
      setProfessions([]);
    }
  }, [selectedRegionId]);

  // Fetch institutes when area changes
  useEffect(() => {
    if (selectedAreaId) {
      const fetchInstitutes = async () => {
        setLoading(prev => ({ ...prev, institutes: true }));
        try {
          const response = await formApi.getInstitutes(selectedAreaId);
          setInstitutes(response.data);
        } catch (error) {
          console.error("Error fetching institutes:", error);
        } finally {
          setLoading(prev => ({ ...prev, institutes: false }));
        }
      };
      fetchInstitutes();
    } else {
      setInstitutes([]);
      setProfessions([]);
    }
  }, [selectedAreaId]);

  // Fetch professions when institute or gender changes
  useEffect(() => {
    if (selectedInstituteId && gender) {
      const fetchProfessions = async () => {
        setLoading(prev => ({ ...prev, professions: true }));
        try {
          const response = await formApi.getProfessions(selectedInstituteId, gender);
          setProfessions(response.data);
        } catch (error) {
          console.error("Error fetching professions:", error);
        } finally {
          setLoading(prev => ({ ...prev, professions: false }));
        }
      };
      fetchProfessions();
    } else {
      setProfessions([]);
    }
  }, [selectedInstituteId, gender]);

  return (
    <>
      <select 
        name="regionId"
        value={selectedRegionId || ''}
        onChange={(e) => onSelectionChange('regionId', e.target.value)}
        required
        disabled={loading.regions}
      >
        <option value="">Select Region</option>
        {regions.map(region => (
          <option key={region.id} value={region.id}>{region.name}</option>
        ))}
      </select>

      <select 
        name="areaId"
        value={selectedAreaId || ''}
        onChange={(e) => onSelectionChange('areaId', e.target.value)}
        disabled={!selectedRegionId || loading.areas}
        required
      >
        <option value="">Select Area</option>
        {areas.map(area => (
          <option key={area.id} value={area.id}>{area.name}</option>
        ))}
      </select>

      <select 
        name="instituteId"
        value={selectedInstituteId || ''}
        onChange={(e) => onSelectionChange('instituteId', e.target.value)}
        disabled={!selectedAreaId || loading.institutes}
        required
      >
        <option value="">Select Institute</option>
        {institutes.map(institute => (
          <option key={institute.id} value={institute.id}>{institute.name}</option>
        ))}
      </select>

      <select 
        name="professionId"
        value={selectedProfessionId || ''}
        onChange={(e) => onSelectionChange('professionId', e.target.value)}
        disabled={!selectedInstituteId || !gender || loading.professions}
        required
      >
        <option value="">Select Profession</option>
        {professions.map(profession => (
          <option key={profession.id} value={profession.id}>{profession.name}</option>
        ))}
      </select>
    </>
  );
}