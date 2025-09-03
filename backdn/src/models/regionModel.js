const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Region = sequelize.define("Region", {
  name: {
    type: DataTypes.STRING(20),
    primaryKey: true,
    validate: {
      isIn: [['NORTHERN', 'CENTRAL', 'SOUTHERN']]
    }
  }
}, {
  timestamps: false,
  tableName: "regions"
});

module.exports = Region;