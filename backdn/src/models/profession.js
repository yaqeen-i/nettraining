const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Profession = sequelize.define("Profession", {
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
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
  },
  allowedGenders: {
    type: DataTypes.JSON,
    allowNull: false
  }
}, {
  timestamps: false,
  tableName: "professions",
  indexes: [
    {
      unique: true,
      fields: ['name', 'areaName', 'regionName'] // Composite unique key
    }
  ]
});

module.exports = Profession;