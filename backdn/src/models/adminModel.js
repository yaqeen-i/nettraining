const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const admin = sequelize.define("admin", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    collate: "utf8mb4_bin",
    validate: {
      len: {
        args: [3, 50],
        msg: "Username must be between 3 and 50 characters"
      }
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [6, 100],
        msg: "Password must be at least 6 characters"
      }
    }
  }
}, {
  timestamps: true,
  tableName: "admins"
}); 

module.exports = admin;