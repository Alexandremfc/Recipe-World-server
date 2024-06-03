const cors = require("cors");
require("dotenv").config();

module.exports = cors({
  origin: [process.env.CLIENT_IP_ADDRESS],
});
