const cors = require("cors");

const CLIENT_IP_ADDRESS = "http://localhost:5173";

module.exports = cors({
  origin: [CLIENT_IP_ADDRESS],
});
