const { UserForm } = require("../models");
const { professionConfig } = require("../config/validationConfig");
const { Op } = require("sequelize"); // Import Sequelize operators

// backdn/src/controllers/formController.js
console.log('Profession config loaded:', professionConfig ? 'Yes' : 'No');
if (professionConfig) {
  console.log('Regions available:', Object.keys(professionConfig.regions));
}

// validation function
function validateFormData(data) {
  const { region, area, institute, profession, gender } = data;
  
  // check if the region exists in the config
  if (!professionConfig.regions[region]) {
    return { valid: false, error: 'Invalid region' };
  }

  // check if the area exists in the region
  const regionData = professionConfig.regions[region];
  if (!regionData.areas[area]) {
    return { valid: false, error: 'Invalid area for this region' };
  }

  // check if the institute exists in the area
  const areaData = regionData.areas[area];
  if (!areaData.institutes.includes(institute)) {
    return { valid: false, error: 'Invalid institute for this area' };
  }

  // check if the profession exists and gender is valid
  const professionData = areaData.professions[profession];
  if (!professionData) {
    return { valid: false, error: 'Invalid profession for this institute' };
  }

  if (!professionData.includes(gender)) {
    return { valid: false, error: 'Invalid profession for this gender' };
  }

  return { valid: true };
}

exports.getForms = async (req, res) => {
  try {
    console.log("Getting all forms...");
    const forms = await UserForm.findAll();
    console.log(`Found ${forms.length} forms`);
    res.json(forms);
  } catch (err) {
    console.error("Error in getForms:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.createForm = async (req, res) => {
  try {
    console.log("POST /forms called");
    console.log("Request body:", req.body);
    
    const { region,
            area,
            institute, 
            profession, 
            nationalID,
            phoneNumber,
            firstName,
            fatherName,
            grandFatherName,
            lastName,
            dateOfBirth,
            gender,
            educationLevel,
            residence,
            howDidYouHearAboutUs } = req.body; 
    
    // Validate required fields
    if( !region || !area || !institute || !profession || !nationalID 
      || !phoneNumber || !firstName || !fatherName || !grandFatherName
      || !lastName || !dateOfBirth || !gender || !educationLevel
      || !residence || !howDidYouHearAboutUs ){
        console.log("Missing required fields:", req.body);
        return res.status(400).json({ 
          error: "Missing required fields",
          received: req.body,
          errDetails: err.errors
        });
      }  
    
    // Check if a form with this nationalID or phoneNumber already exists
    const existingForm = await UserForm.findOne({
      where: {
        [Op.or]: [
          { nationalID: nationalID },
          { phoneNumber: phoneNumber }
        ]
      }
    });
    
    if (existingForm) {
      console.log("Duplicate form found:", existingForm.toJSON());
      return res.status(409).json({ 
        error: "A form with this National ID or Phone Number already exists" 
      });
    }
    
    const validation = validateFormData({
      region, 
      area, 
      institute, 
      profession, 
      gender
    });
    
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }
    
    console.log("All required fields are present");
    console.log("Creating form with data:", req.body);
    
    const newForm = await UserForm.create({ 
                                        region,
                                        area,
                                        institute, 
                                        profession, 
                                        nationalID,
                                        phoneNumber,
                                        firstName,
                                        fatherName,
                                        grandFatherName,
                                        lastName,
                                        dateOfBirth,
                                        gender,
                                        educationLevel,
                                        residence,
                                        howDidYouHearAboutUs }); 
                                        
    console.log("Form created successfully:", newForm.toJSON());
    
    res.status(201).json(newForm);
  } catch (err) {
    console.error("Error in createForm:", err);
    
    // Handle duplicate key error from database
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ 
        error: "A form with this National ID or Phone Number already exists" 
      });
    }
    
    res.status(500).json({ error: err.message, details: err.errors });
  }
};

exports.putForm = async (req, res) => {
  try {
    const { id } = req.params;
    const formData = req.body;

    const validation = validateFormData({
      region: formData.region,
      area: formData.area,
      institute: formData.institute, 
      profession: formData.profession,
      gender: formData.gender
    });
    
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }
    
    const [updatedRowsCount, updatedRows] = await UserForm.update(formData, {
      where: { id: id },
      returning: true
    });
    
    if (updatedRowsCount === 0) {
      return res.status(404).json({ error: 'Form not found' });
    }
    
    res.json(updatedRows[0]);
  } catch (error) {
    console.error('Error updating form:', error);
    res.status(500).json({ error: error.message });
  }
};