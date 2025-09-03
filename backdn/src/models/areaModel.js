const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Area = sequelize.define("Area", {
  name: {
    type: DataTypes.STRING(100),
    primaryKey: true
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
  tableName: "areas"
});

module.exports = Area;