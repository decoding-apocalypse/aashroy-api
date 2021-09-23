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
  const { donorDetails, items, location, date} = req.body;
  const userLocation = {
    lat: location.latitude,
    lng: location.longitude
  }
  const nearestNgo = shortestDistanceNGO(ngosData.NGO, userLocation);
  // console.log(nearestNgo);
  const emailContent  = {
    subject: "",
    html: `
          Dear <NGO name>
          MR <> wants to send food/clothes/medicine or similar commodities to help your organization in the minimalistic way possible. His contact and address details as uploaded are :
    
          Name:
          Location:
          Commodity: food/medicine/clothes
          Preferable pickup date:
          Contact no:
    
          We here at AASHROY believe that every drop makes an ocean and each help makes a difference in making the world a better place to live in.
    
          With regards,
          TEAM AASHROY`,
  }
  res.json(mailer(nearestNgo.email, emailContent));
});



module.exports = router;
