const express = require("express");
const cors = require("cors");
const formRoutes = require("./routes/formRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors());
app.use(express.json()); // note was bodyParser.json() -> to use express's built-in json parser

app.use("/forms", formRoutes);
app.use("/admin", adminRoutes);

module.exports = app;