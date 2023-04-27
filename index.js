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
// const passport = require("./config/passportConfig");
const passport = require("passport");
const expressSession = require("express-session");
const User = require("./models/usersModel");
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GoogleStrategy = require("passport-google-oauth20").Strategy;

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
    saveUninitialized: true,
    cookie: {
      secure: true,
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "none",
    },
  })
);

//INITIALIZE PASSPORT
app.use(passport.initialize());

// PASSPORT SESSION CALL THE DESERIALIZEUSER FUNCTION AND PASS THE USER ID TO THE PARAMETER OF THIS FUNCTION
app.use(passport.session());

//IMPLEMENT GOOGLE STRATEGY
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `https://nasa-app-backend.vercel.app/auth/google/callback`,
    },
    function (_accessToken, _refreshToken, profile, done) {
      const { id: google_id, name: nameObj } = profile;

      //CHECK TO SEE IF THIS USER IS IN DATABASE
      User.findOne({ google_id: google_id, username: nameObj.givenName })
        .then((user) => {
          //IF THIS USER EXISTS IN DATABASE
          if (user) {
            done(null, { _id: user._id });
          }

          //IF THIS IS A NEW USER
          else {
            User.create({ google_id: google_id, username: nameObj.givenName })
              .then((res) => {
                done(null, { _id: res._id });
              })
              .catch((e) => console.log(`Error creating a user ${e}`));
          }
        })
        .catch((e) => console.log(`Error fetching a user ${e}`));
    }
  )
);

//SET UP SERIALIZEUSER
passport.serializeUser((userObj, done) => {
  done(null, userObj._id);
});

//SSET UP DESERIALIZEUSER
passport.deserializeUser((userId, done) => {
  User.findOne({ _id: userId })
    .then((user) => done(null, { _id: user._id, username: user.username }))
    .catch((e) => {
      console.log("Error finding user");
    });
});

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
