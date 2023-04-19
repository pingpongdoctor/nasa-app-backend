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

//APPLY CORS MIDDLEWARE TO ALLOW DATABASE ACCESSED FROM ANY DOMAINS AND TO ALLOW USING MULTIPLE ORIGINS (HEADERS AND COOKIES)
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
//APPLY MIDDLEWARE TO PARSE DATA IN REQUEST BODY AND MAKE IT AVAILABLE IN REQ.BODY
app.use(express.json());
//APPLY HELMET TO ADD SOME HTTP HEADERS FOR SECURITY ENHANCEMENT
app.use(helmet());
//APPLY COOKIE PARSER TO PARSE DATA IN COOKIE AND MAKE IT AVAILABLE IN REQ.COOKIES
app.use(cookieparser());

app.use((req, res, next) => {
  console.log("Logging request:", req.method, req.url);
  next();
});

//SET TUP THE EXPRESS SESSION MIDDLEWARE
app.use(
  expressSession({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000, httpOnly: true, sameSite: "lax" },
  })
);

//INITIALIZE PASSPORT
app.use(passport.initialize());

// PASSPORT SESSION COVERT SESSION ID IN COOKIE TO USER ID AND PASS IT TO DESERIALIZE USER FUNCTION
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
