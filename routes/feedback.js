const express = require("express");
const ngosData = require("../helper/ngosData");
const shortestDistanceNGO = require("../helper/shortestDistance");
const mailer = require("../utils/mailer");
const router = express.Router();

router.post("/", (req, res) => {
  const {email} = req.body;
  const emailContent = {
    subject: "feedback response from aashroy",
    html: `Thank you for your valuable feedback`,
  }
  res.json(mailer(email, emailContent));
});

router.post("/report", (req, res) => {
  const {location, complaint} = req.body;
  const particularNgo = shortestDistanceNGO(ngosData.NGO, location);
  const emailContent = {
    subject: "anonymous complaint",
    html: `<p>This is complaint at ${location} and the complaint is ${complaint}</p>`
  }

  res.json(mailer(particularNgo.email, emailContent));
});

module.exports = router;
