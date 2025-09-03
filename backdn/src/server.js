const app = require("./app");
const dotenv = require("dotenv");
const { sequelize, Region, Area, Institute, Profession, UserForm, Admin } = require("./models");

dotenv.config();

const PORT = process.env.PORT;

// Test databa se connection and sync models in correct order
sequelize.authenticate()
  .then(async () => {
    console.log("Database connection established successfully");
    
    // sync models in correct order to avoid fk issues , I can do sequelize.sync() only if no foreign keys
    // were involved, I have to do it manually in order to avoid fk issues
    await Region.sync({ force: false });
    await Area.sync({ force: false });
    await Institute.sync({ force: false });
    await Profession.sync({ force: false });
    await UserForm.sync({ force: false });
    await Admin.sync({ force: false });
    
    console.log("Database synced successfully");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log("Available routes:");
      console.log("GET http://localhost:" + PORT + "/forms");
      console.log("POST http://localhost:" + PORT + "/forms");
      console.log("PUT http://localhost:" + PORT + "/forms/:id");
    });
  })
  .catch(err => {
    console.error("Database connection/sync failed:");
    console.error(err);
    process.exit(1);
  });