const userForm = require("../models/formModel");
const Admin = require("../models/adminModel");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const e = require("express");


exports.registerAdmin = async (req, res) => {
  try {
    const salt = await bcryptjs.genSalt();
    
    const { username, email, password } = req.body;

    const passwordHash = await bcryptjs.hash(password, salt);

    console.log("salt= "+ salt);
    console.log("hashed password= " + passwordHash);
    // Check if the admin already exists
    const existingAdmin = await Admin.findOne({ where: { username } });
    if (existingAdmin) {
      return res.status(400).json({ error: "Admin already exists" });
    }

    // Hash the password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create a new admin
    const newAdmin = await Admin.create({ username,
                                            email,
                                           password: hashedPassword });

    res.status(201).json({ message: "Admin registered successfully", admin: newAdmin });
  } catch (err) {
    console.error("Error in registerAdmin:", err);
    res.status(500).json({ error: err.message , errDetails: err.errors });
  }
}

exports.loginAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;
    
        //  admin by username
        const admin = await Admin.findOne({ where: { username } });
        if (!admin) {
        return res.status(400).json({ error: "Invalid username or password" });
        }
    
        // compare the provided password with the stored hashed password
        const isMatch = await bcryptjs.compare(password, admin.password);
        if (!isMatch) {
        return res.status(400).json({ error: "Invalid username or password" });
        }
    
        // generate a JWT token
        const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, { expiresIn: '30D' });
    
        res.json({ message: "Login successful", token });
    } catch (err) {
        console.error("Error in loginAdmin:", err);
        res.status(500).json({ error: err.message , errDetails: err.errors});
    }
    }


exports.getAdminById = async (req, res) => {
      try {
        const { id } = req.params;
        const admin = await Admin.findByPk(id, {
          attributes: { exclude: ['password'] } // exclude password from the response, security obviously
        });
        if (!admin) {
          return res.status(404).json({ error: "Admin not found" });
        }
        res.json(admin);
      } catch (err) {
        console.error("Error in getAdminById:", err);
        res.status(500).json({ error: err.message , errDetails: err.errors });
      }
    };
    
exports.logoutAdmin = (req, res) => {
    // Since JWTs are stateless, logout can be handled on the client side by simply deleting the token.
    // For example, if the token is stored in localStorage:
    // localStorage.removeItem('token');
    // Or if stored in a cookie, clear the cookie on the client.
    // Here, I just send a response indicating logout was successful.
    // but actually no server-side action is needed for JWT logout.
    // so I invalidate the token on ---client--- side
    /**
     *  React onClick handler
const handleLogout = async () => {
  try {
    const token = localStorage.getItem("token");
    localStorage.removeItem("token");
    
    window.location.href = "/login";

  } catch (err) {
    console.error("Logout error:", err);
    // Even if server fails, still remove token locally
    localStorage.removeItem("token");
    window.location.href = "/login";
  }
};

     */
      res.json({ message: "Logout successful" });
    }

exports.deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRowsCount = await Admin.destroy({ where: { id } });
    if (deletedRowsCount === 0) {
      return res.status(404).json({ error: "Admin not found" });
    }
    res.json({ message: "Admin deleted successfully" });
  } catch (err) {
    console.error("Error in deleteAdmin:", err);
    if (err.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ error: "Cannot delete admin with existing dependencies" });
    }
    res.status(500).json({ error: err.message , errDetails: err.errors });
  }
};