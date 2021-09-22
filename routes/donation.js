const express = require("express");
const router = express.Router();
const Donation = require("../models/Donation");

router.get("/", async (req, res) => {
  try {
    const allDonations = await Donation.find({});
    res.json(allDonations);
  } catch (error) {
    res.json(error);
  }
});



// stuffs post req to send email to NGOs using algorithm

// get request for all donations

module.exports = router;








