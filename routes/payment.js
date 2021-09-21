const express = require("express");
const router = express.Router();
const Donation = require("../models/Donation");
const { v4: uuid } = require("uuid");

router
  .route("/")
  .get(async (req, res) => {
    const { userId } = req.query;
    try {
      const donationList = await Donation.find({ userId });
      res.json(donationList);
    } catch (err) {
      res.json({ data: "Error" });
    }
  })
  .post(async (req, res) => {
    const { userId, amount } = req.body;
    const transactionID = uuid();
    try {
      if (!userId) {
        res.json({
          success: false,
          message: "You must be logged in to donate",
        });
      }
      if (amount <= 0) {
        res.json({
          success: false,
          message: "Amount must be greater than zero",
        });
      }
      const newDonation = await new Donation({
        userId,
        amount,
        transactionID,
        date: new Date(),
      });
      const donation = await newDonation.save();
      // mail to user thanking for donating
      res.json({
        success: true,
        message: "Thank you for donating",
        data: donation,
      });
    } catch (err) {
      res.json({
        success: false,
        message: "Error Occured, Please try again",
      });
    }
  });

module.exports = router;
