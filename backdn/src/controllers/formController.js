const userForm = require("../models/formModel"); 
const { professionConfig } = require("../config/validationConfig");

// At the top of your controller, after the require statements
console.log('Profession config loaded:', professionConfig ? 'Yes' : 'No');
if (professionConfig) {
  console.log('Regions available:', Object.keys(professionConfig.regions));
}

// Add validation function
function validateFormData(data) {
  const { region, area, institute, profession, gender } = data;
  
  // Check if the region exists in the config
  if (!professionConfig.regions[region]) {
    return { valid: false, error: 'Invalid region' };
  }

  // Check if the area exists in the region
  const regionData = professionConfig.regions[region];
  if (!regionData.areas[area]) {
    return { valid: false, error: 'Invalid area for this region' };
  }

  // Check if the institute exists in the area
  const areaData = regionData.areas[area];
  if (!areaData.institutes.includes(institute)) {
    return { valid: false, error: 'Invalid institute for this area' };
  }

  // Check if the profession exists and gender is valid
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
    const forms = await userForm.findAll();
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
            institue,
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
    if( !region || !area || !institue || !profession || !nationalID 
      || !phoneNumber || !firstName || !fatherName || !grandFatherName
      || !lastName || !dateOfBirth || !gender || !educationLevel
      || !residence || !howDidYouHearAboutUs ){
        console.log("Missing required fields:", req.body);
        return res.status(400).json({ 
          error: "Missing required fields",
          received: req.body
        });
      }
    
    // Add validation
    const validation = validateFormData({
      region, 
      area, 
      institute: institue, // Note: using 'institue' from request but 'institute' in validation
      profession, 
      gender
    });
    
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }
    
    console.log("All required fields are present");
    console.log("Creating form with data:", req.body);
    
    const newForm = await userForm.create({ 
                                        region,
                                        area,
                                        institue,
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
    console.error("Error stack:", err.stack);
    console.error("Error errors array:", err.errors);
    res.status(500).json({ error: err.message, details: err.errors });
  }
};

exports.putForm = async (req, res) => {
  try {
    const { id } = req.params;
    const formData = req.body;

    // Add validation
    const validation = validateFormData({
      region: formData.region,
      area: formData.area,
      institute: formData.institue,
      profession: formData.profession,
      gender: formData.gender
    });
    
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }
    
    const [updatedRowsCount, updatedRows] = await userForm.update(formData, {
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