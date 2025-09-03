const sequelize = require("../config/db");
// models
const Region = require("./regionModel");
const Area = require("./areaModel");
const Institute = require("./institute");
const Profession = require("./profession");
const UserForm = require("./formModel");
const Admin = require("./adminModel");

// associations
Region.hasMany(Area, { foreignKey: 'regionName', sourceKey: 'name' });
Area.belongsTo(Region, { foreignKey: 'regionName', targetKey: 'name' });

Area.hasMany(Institute, { foreignKey: 'areaName', sourceKey: 'name' });
Institute.belongsTo(Area, { foreignKey: 'areaName', targetKey: 'name' });

Area.hasMany(Profession, { foreignKey: 'areaName', sourceKey: 'name' });
Profession.belongsTo(Area, { foreignKey: 'areaName', targetKey: 'name' });

Region.hasMany(Profession, { foreignKey: 'regionName', sourceKey: 'name' });
Profession.belongsTo(Region, { foreignKey: 'regionName', targetKey: 'name' });

// UserForm associations
UserForm.belongsTo(Region, { foreignKey: 'region', targetKey: 'name' });
UserForm.belongsTo(Area, { foreignKey: 'area', targetKey: 'name' });
UserForm.belongsTo(Institute, { foreignKey: 'institute', targetKey: 'name' });
UserForm.belongsTo(Profession, { foreignKey: 'profession', targetKey: 'name' });

module.exports = {
  sequelize,
  Region,
  Area,
  Institute,
  Profession,
  UserForm,
  Admin
};