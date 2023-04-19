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
const User = require("./models/usersModel");
//GOOGLE AUTHENTICATION NEDDED LIBRARIES
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const expressSession = require("express-session");
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const SESSION_SECRET = process.env.SESSION_SECRET;

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

// Include express-session middleware (with additional config options required for Passport session)
app.use(
  expressSession({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Initialize Passport middleware
app.use(passport.initialize());

// Passport.session converting session id from the client cookie into a deserialized user object
app.use(passport.session());

//Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `http://localhost:${PORT}/auth/google/callback`,
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log(profile.id);
      // User.findOne({ googleId: profile.id }).then((data) => console.log(data));
    }
  )
);

// `serializeUser` determines which data of the auth user object should be stored in the session
passport.serializeUser((user, done) => {
  console.log("serializeUser (user object):", user);

  // Store only the user id in session
  done(null, user.id);
});

// `deserializeUser` receives a value sent from `serializeUser` `done` function
// We can then retrieve full user information from our database using the userId
passport.deserializeUser((userId, done) => {
  console.log(userId);
});

//CONNECT TO THE MONGODB DATABASE
handleConnectMongoDBServer();

//APPLY ROUTES
app.use("/user-profile", userProfileRoute);
app.use("/login", loginRoute);
app.use("/signup", signupRoute);
app.use("/logout", logoutRoute);

app.use("/", (req, res) => {
  res.send("Hello");
});

//START THE SERVER
app.listen(PORT, (req, res) => {
  console.log(`Website is listening to the port http://localhost:${PORT}`);
});
