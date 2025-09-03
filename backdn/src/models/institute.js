const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Institute = sequelize.define("Institute", {
  name: {
    type: DataTypes.STRING(100),
    primaryKey: true
  },
  areaName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    references: {
      model: 'areas',
      key: 'name'
    }
  },
  regionName: {
    type: DataTypes.STRING(20),
    allowNull: false,
    references: {
      model: 'regions',
      key: 'name'
    }
  }
}, {
  timestamps: false,
  tableName: "institutes"
});

module.exports = Institute;