const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const path = require("path");
const fs = require("fs");
const moment = require("moment");
const cors = require("cors");

const jwtSecret = process.env.JWT_SECRET || "shhhhhh";
const cookieName = process.env.COOKIE_NAME || "DEV_USER";
const refreshCookieName = process.env.REFRESH_COOKIE_NAME || "DEV_USER_REFRESH";
const baseSelf = process.env.API_BASE || "localhost";
const corsOrigin = process.env.CORS_ORIGIN || "localhost";
const cookieDomain = process.env.COOKIE_DOMAIN || "localhost";

const corsOptions = {
  credentials: true,
  origin: corsOrigin
};

const cookieOptions = (httpOnly, expiry) => {
  const options = { httpOnly, expires: expiry };
  if (cookieDomain !== "localhost") {
    options.domain = cookieDomain;
  }
  return options;
};

app.use(cookieParser());
app.use(cors(corsOptions));

app.options("*", cors(corsOptions));

app.get("/login", (req, res) => {
  let returnUrl = new Buffer("/debug").toString("base64");
  if (req.query.return) {
    returnUrl = req.query.return;
  }

  let html = "<div>Login as:<br />";
  const thePath = path.join(__dirname, "./users");
  fs.readdir(thePath, function(error, items) {
    items.forEach(item => {
      html +=
        "<div><a href=/cookies/" +
        item.replace(".json", "") +
        "?return=" +
        returnUrl +
        ">" +
        item.replace(".json", "") +
        "</a></div>";
    });

    html += "</div>";
    res.send(html);
  });
});

app.get("/refresh", (req, res) => {
  const theJwt = req.cookies[cookieName];
  const expiry = moment(new Date())
    .add(10, "minutes")
    .toDate();

  // Login token
  res.cookie(cookieName, theJwt, cookieOptions(true, expiry));

  // Refresh token
  res.cookie(
    refreshCookieName,
    Buffer.from(
      JSON.stringify({
        expiry: Math.floor(expiry.getTime() / 1000),
        refresh: baseSelf + "/refresh"
      })
    ).toString("base64"),
    cookieOptions(false, expiry)
  );
  res.send("ok");
});

app.get("/logout", (req, res) => {
  let returnUrl = "/debug";
  if (req.query.return) {
    returnUrl = Buffer.from(req.query.return, "base64").toString();
  }

  res.cookie(cookieName, "", {
    httpOnly: true,
    domain: cookieDomain,
    expires: new Date()
  });
  res.redirect(returnUrl);
});

app.get("/debug", (req, res) => {
  res.json({
    status: "ok",
    cookieDomain,
    cookieName,
    jwtSecret
  });
});

app.get("/cookies/:username", (req, res) => {
  let returnUrl = "/debug";
  if (req.query.return) {
    returnUrl = Buffer.from(req.query.return, "base64").toString();
  }

  const expiry = moment(new Date())
    .add(10, "minutes")
    .toDate();

  const u = require(path.join(
    __dirname,
    `./users/${req.params.username}.json`
  ));
  // Login token
  const token = jwt.sign(u, jwtSecret);
  res.cookie(cookieName, token, cookieOptions(true, expiry));

  // Refresh token
  res.cookie(
    refreshCookieName,
    Buffer.from(
      JSON.stringify({
        expiry: Math.floor(expiry.getTime() / 1000),
        refresh: baseSelf + "/refresh"
      })
    ).toString("base64"),
    cookieOptions(false, expiry)
  );

  // Redirect user back
  res.redirect(returnUrl);
});

// PUBLICS
app.use(express.static("public"));

app.listen(3000, () => console.log(`Cookie setting running on port 3000!`));
