const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

const cookieDomain = process.env.COOKIE_DOMAIN || "localhost";
const jwtSecret = process.env.JWT_SECRET || "shhhhhh";
const cookieName = process.env.COOKIE_NAME || "DEV_USER";

app.get("/debug", (req, res) => {
  res.json({
    status: "ok",
    cookieDomain,
    cookieName,
    jwtSecret
  });
});

app.get("/cookies/:username", (req, res) => {
  const u = require(`./users/${req.params.username}.json`);
  const token = jwt.sign(u, jwtSecret);
  res.cookie(cookieName, token, { httpOnly: true, domain: cookieDomain });
  res.json({ message: "Ok, cookie set!" });
});

// PUBLICS
app.use(express.static("public"));

app.listen(3000, () => console.log(`Cookie setting running on port 3000!`));
