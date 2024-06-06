const cors = require("cors");
require("dotenv").config();

const ORIGIN =  process.env.ORIGIN || "http://localhost:5173";

module.exports = cors({
  origin: [ORIGIN],
});
