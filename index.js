require("dotenv").config();
const handleConnectMongoDBServer = require("./config/db");
const express = require("express");
const app = express();
const cors = require("cors");
const cookieparser = require("cookie-parser");
const helmet = require("helmet");
const PORT = process.env.PORT || 8080;
const loginRoute = require("./routes/loginRoute");
const signupRoute = require("./routes/signupRoute");
const userProfileRoute = require("./routes/userProfileRoute");

//APPLY CORS MIDDLEWARE TO ALLOW DATABASE ACCESSED FROM ANY DOMAINS
app.use(cors());
//APPLY MIDDLEWARE TO PARSE DATA IN REQUEST BODY AND MAKE IT AVAILABLE IN REQ.BODY
app.use(express.json());
//APPLY HELMET TO ADD SOME HTTP HEADERS FOR SECURITY ENHANCEMENT
app.use(helmet());
//APPLY COOKIE PARSER TO PARSE DATA IN COOKIE AND MAKE IT AVAILABLE IN REQ.COOKIES
app.use(cookieparser());

//CONNECT TO THE MONGODB DATABASE
handleConnectMongoDBServer();

//APPLY ROUTES
app.use("./user-profile", userProfileRoute);
app.use("/login", loginRoute);
app.use("/signup", signupRoute);

app.use("/", (req, res) => {
  res.send("Hello");
});

//START THE SERVER
app.listen(PORT, (req, res) => {
  console.log(`Website is listening to the port http://localhost:${PORT}`);
});
