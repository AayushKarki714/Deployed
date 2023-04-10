const path = require("path");
const cors = require("cors");
const express = require("express");
const passport = require("passport");
const { Strategy } = require("passport-google-oauth20");
const cookieSession = require("cookie-session");
const app = express();

let CLIENT_URL = "http://localhost:3000";
passport.use(
  new Strategy(
    {
      clientID:
        "872559633714-0njib03dcbunna13jqg2lvkarioliblu.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "/auth/google/callback",
    },
    function verify(accessToken, refreshToken, user, done) {
      console.log({ accessToken, refreshToken, user, done });
      return done(null, user);
    }
  )
);

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(
  cookieSession({
    name: "cookie",
    keys: ["nice@123"],
  })
);

app.use((req, res, next) => {
  console.log({ session: req.session });
  next();
});

app.get("/login", (req, res) => {
  return res.sendFile(path.join(__dirname, "..", "views", "login.html"));
});

// This gets called
app.get("/auth/google", passport.authenticate("google", { scope: ["email"] }));
// Authorization code to autorize iniates
// Redirect to Login, Authorization
// Authenticate and Consent
// Authorization code to client
// Authrozation code, clientId, client Secret pathauxa
// validates it
// sends id access token

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: `${CLIENT_URL}/dashboard`,
    failureRedirect: `${CLIENT_URL}/login`,
  })
);

passport.serializeUser((user, done) => {
  console.log({ user });
  return done(null, user.id);
});

passport.deserializeUser((userId, done) => {
  console.log({ userId });
  return done(null, userId);
});

app.use(passport.initialize());
app.use(passport.session());

app.get(
  "/secret",
  function (req, res, next) {
    const userExists = req.isAuthenticated() && req.user;
    if (!userExists) return res.sendStatus(401);
    next();
  },
  function (req, res) {
    return res
      .status(200)
      .json({ message: `The Secret Message is ${JSON.stringify(req.user)}` });
  }
);

module.exports = app;
