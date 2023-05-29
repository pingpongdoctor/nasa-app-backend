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
const { createUser } = require("./script");

//SET UP CORS MIDDLEWARE
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

//MIDDLEWARE TO PARSE DATA IN REQUEST BODY AND MAKE IT AVAILABLE IN REQ.BODY
app.use(express.json());

//APPLY HELMET TO ADD SOME HTTP HEADERS FOR SECURITY ENHANCEMENT
app.use(helmet());

//APPLY COOKIE PARSER TO PARSE DATA STORED IN COOKIE AND MAKE IT AVAILABLE IN REQ.COOKIES
app.use(cookieparser());

//CONNECT TO THE MONGODB DATABASE
handleConnectMongoDBServer();

createUser();

//APPLY ROUTES
app.use("/login", loginRoute);
app.use("/signup", signupRoute);

//START THE SERVER
app.listen(PORT, (req, res) => {
  console.log(`Website is listening to the port http://localhost:${PORT}`);
});
