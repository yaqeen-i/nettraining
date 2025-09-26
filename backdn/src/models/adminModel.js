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
    collate: "utf8mb4_bin"
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
    allowNull: false
  }
}, {
  timestamps: true,
  tableName: "admins"
}); 

module.exports = admin;