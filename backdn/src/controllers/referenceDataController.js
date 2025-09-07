const { Region, Area, Institute, Profession } = require("../models");
// backdn/src/controllers/referenceDataController.js

exports.getRegions = async (req, res) => {
  try {
    const regions = await Region.findAll({
      attributes: ['name'],
      order: [['name', 'ASC']]
    });
    res.json(regions.map(region => region.name));
  } catch (error) {
    console.error("Error fetching regions:", error);
    res.status(500).json({ error: "Failed to fetch regions" });
  }
};

exports.getAreas = async (req, res) => {
  try {
    const { region } = req.query;
    if (!region) {
      return res.status(400).json({ error: "Region parameter is required" });
    }
    
    const areas = await Area.findAll({
      where: { regionName: region },
      attributes: ['name'],
      order: [['name', 'ASC']]
    });
    res.json(areas.map(area => area.name));
  } catch (error) {
    console.error("Error fetching areas:", error);
    res.status(500).json({ error: "Failed to fetch areas" });
  }
};

exports.getInstitutes = async (req, res) => {
  try {
    const { region, area } = req.query;
    if (!region || !area) {
      return res.status(400).json({ error: "Region and area parameters are required" });
    }
    
    const institutes = await Institute.findAll({
      where: { regionName: region, areaName: area },
      attributes: ['name'],
      order: [['name', 'ASC']]
    });
    res.json(institutes.map(institute => institute.name));
  } catch (error) {
    console.error("Error fetching institutes:", error);
    res.status(500).json({ error: "Failed to fetch institutes" });
  }
};

exports.getProfessions = async (req, res) => {
  try {
    const { region, area, institute, gender } = req.query;
    if (!region || !area || !institute || !gender) {
      return res.status(400).json({ error: "Region, area, institute, and gender parameters are required" });
    }
    
    const professions = await Profession.findAll({
      where: { 
        regionName: region, 
        areaName: area,
      },
      attributes: ['name', 'allowedGenders'],
      order: [['name', 'ASC']]
    });
    
    // filter professions by allowed genders
    const filteredProfessions = professions.filter(profession => {
      return profession.allowedGenders.includes(gender);
    });
    
    res.json(filteredProfessions.map(profession => profession.name));
  } catch (error) {
    console.error("Error fetching professions:", error);
    res.status(500).json({ error: "Failed to fetch professions" });
  }
};
