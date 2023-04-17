require("dotenv").config();
const handleConnectMongoDBServer = require("./config/db");
const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 8080;

//APPLY CORS MIDDLEWARE TO ALLOW DATABASE ACCESSED FROM ANY DOMAINS
app.use(cors());
//APPLY MIDDLEWARE TO PARSE DATA IN REQUEST BODY AND MAKE IT AVAILABLE IN REQ.BODY
app.use(express.json());

//CONNECT TO THE MONGODB DATABASE
handleConnectMongoDBServer();

//START THE SERVER
app.listen(PORT, (req, res) => {
  console.log(`Website is listening to the port http://localhost:${PORT}`);
});
