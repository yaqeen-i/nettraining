const app = require("./app");
const dotenv = require("dotenv");
const sequelize = require("./config/db");
require("./models/formModel");
require("./models/adminModel");

dotenv.config();

const PORT = process.env.PORT;

// Test database connection
sequelize.authenticate()
  .then(() => {
    console.log("Database connection established successfully");
    return sequelize.sync();
  })
  .then(() => {
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