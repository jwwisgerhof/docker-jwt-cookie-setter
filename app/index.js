const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

const cookieDomain = process.env.COOKIE_DOMAIN || "localhost";
const jwtSecret = process.env.JWT_SECRET || "shhhhhh";
const cookieName = process.env.COOKIE_NAME || "DEV_USER";

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

  const u = require(path.join(
    __dirname,
    `./users/${req.params.username}.json`
  ));
  const token = jwt.sign(u, jwtSecret);
  res.cookie(cookieName, token, { httpOnly: true, domain: cookieDomain });
  res.redirect(returnUrl);
});

// PUBLICS
app.use(express.static("public"));

app.listen(4000, () => console.log(`Cookie setting running on port 3000!`));
