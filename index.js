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
const logoutRoute = require("./routes/logoutRoute");
const SESSION_SECRET = process.env.SESSION_SECRET;
const googleAuthRoute = require("./routes/googleAuthRoute");
//GOOGLE AUTHENTICATION NEDDED LIBRARIES
const passport = require("./config/passportConfig");
const expressSession = require("express-session");

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

//SET UP THE EXPRESS SESSION MIDDLEWARE
app.use(
  expressSession({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    // cookie: {
    //   maxAge: 60 * 60 * 1000,
    //   httpOnly: true,
    //   secure: true,
    // },
  })
);

//INITIALIZE PASSPORT
app.use(passport.initialize());

// PASSPORT SESSION CALL THE DESERIALIZEUSER FUNCTION AND PASS THE USER ID TO THE PARAMETER OF THIS FUNCTION
app.use(passport.session());

//CONNECT TO THE MONGODB DATABASE
handleConnectMongoDBServer();

//APPLY ROUTES
app.use("/auth", googleAuthRoute); //Put the /auth first to ensure that req.user is set before the JWT check token middlewares are invoked
app.use("/user-profile", userProfileRoute);
app.use("/login", loginRoute);
app.use("/signup", signupRoute);
app.use("/logout", logoutRoute);

//START THE SERVER
app.listen(PORT, (req, res) => {
  console.log(`Website is listening to the port http://localhost:${PORT}`);
});
