const express = require("express");
const ngosData = require("../helper/ngosData");
const shortestDistanceNGO = require("../helper/shortestDistance");
const router = express.Router();
const Donation = require("../models/Donation");
const mailer = require("../utils/mailer");

// get request for all donations
router.get("/", async (req, res) => {
  try {
    const allDonations = await Donation.find({});
    res.json(allDonations);
  } catch (error) {
    res.json(error);
  }
});

// stuffs post req to send email to NGOs using algorithm
router.post("/stuffs", async (req, res) => {
  const { donorDetails, items, location, date } = req.body;
  const userLocation = {
    lat: location.latitude,
    lng: location.longitude,
  };
  const nearestNgo = shortestDistanceNGO(ngosData.NGO, userLocation);
  // console.log(nearestNgo);
  const emailContent = {
    subject: "Donation Pickup Request @ Aashroy | Decoding Apocalypse",
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
      <h3>Hello ${nearestNgo.name},</h3>
      <p>
        Mr/Mrs ${
          donorDetails.name
        } wants to send food/clothes/medicine or similar
        commodities to help your organization in the minimalistic way
        possible. ${donorDetails.name} has placed an order in our
        <a href="https://aashroy.netlify.app/">website</a> and the details are
        as follows:
      </p>
      <div
        style="
          margin: auto;
          padding: 1.5rem;
          width: 70vw;
          border-radius: 10px;
          box-shadow: 2px 2px 10px #cccccc;
          background-color: white;
        "
      >
        <h4>Name: ${donorDetails.name}</h4>
        <h4>Phone: ${donorDetails.phone}</h4>
        <h4>Email: ${donorDetails.email}</h4>
        <h4>
          Location:<a
            href="https://www.google.com/maps/search/?api=1&query=${
              location.latitude
            },${location.longitude}"
          >
            ${location.place}, ${location.state}
          </a>
        </h4>
        <h4>Pickup date and time: ${new Date(date).toLocaleString()}</h4>
        <div style="text-align: center;padding: 0;">
          <ul style="list-style: none">
            <li>Food: ${items.food}</li>
            <li>Clothes: ${items.clothes}</li>
            <li>Medicines: ${items.medicines}</li>
          </ul>
        </div>
      </div>
      <h4>Thank you,</h4>
      <h4>Team Aashroy</h4>
    </div>
  </div>`,
  };
  res.json(mailer(nearestNgo.email, emailContent));
});

module.exports = router;
