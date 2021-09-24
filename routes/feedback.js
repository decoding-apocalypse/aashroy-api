const express = require("express");
const ngosData = require("../helper/ngosData");
const shortestDistanceNGO = require("../helper/shortestDistance");
const mailer = require("../utils/mailer");
const router = express.Router();

router.post("/", (req, res) => {
  const { name, email } = req.body;
  const emailContent = {
    subject: "Thank you @ Aashroy | Decoding Apocalypse",
    html: ` <div
    style="
      text-align: center;
      font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande',
        'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
      background-color: #f1f1f1;
      height: 100%;
      width: 100vw;
      padding: 2rem;
    "
  >
    <h1 style="text-decoration: underline">Aashroy | Decoding Apocalypse</h1>
    <img
      style="width: 80px"
      src="https://aashroy.netlify.app/img/icons/fav-logo.png"
      alt="Logo"
    />
    <div style="text-align: left">
      <h3>Dear ${name},</h3>
      <p>
        Thankyou for your valuable feedback and suggestions for Ashroy. We try
        to improve and work hard to make surfing and user interface better
        with every passing day. We are striving 24 * 7 trying to improve and
        make the world a better place to live in, one small step at a time.
      </p>

      <h4>Thank you,</h4>
      <h4>Team Aashroy</h4>
    </div>
  </div>`,
  };
  res.json(mailer(email, emailContent));
});

router.post("/report", (req, res) => {
  const { location, complaint } = req.body;
  const userLocation = {
    lat: location.latitude,
    lng: location.longitude,
  };
  const particularNgo = shortestDistanceNGO(ngosData.NGO, userLocation);
  const emailContent = {
    subject: "Anonymous Complant @ Aashroy | Decoding Apocalypse",
    html: `<div
    style="
      text-align: center;
      font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande',
        'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
      background-color: #f1f1f1;
      height: 100%;
      width: 100vw;
      padding: 2rem;
    "
  >
    <h1 style="text-decoration: underline">Aashroy | Decoding Apocalypse</h1>
    <img
      style="width: 80px"
      src="https://aashroy.netlify.app/img/icons/fav-logo.png"
      alt="Logo"
    />
    <div style="text-align: left">
      <h3>Hello ${particularNgo.name},</h3>
      <p>
        Dear ${particularNgo.name}, an anonymous complaint has been made to us in
        <a href="https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}">${location.place}</a>. We request you to send urgent help and support to the
        person affected. Any sort of help from your end will be highly
        solicited
      </p>
      <p>
        The complaint is as follows:
        <br />
        <br />
        ${complaint}
      </p>

      <h4>Thank you,</h4>
      <h4>Team Aashroy</h4>
    </div>
  </div>`,
  };

  res.json(mailer(particularNgo.email, emailContent));
});

module.exports = router;
