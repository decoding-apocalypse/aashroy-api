const express = require("express");
const router = express.Router();
const Donation = require("../models/Donation");
const User = require("../models/User");
const mailer = require("../utils/mailer");
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
      const user = await User.findById(userId);
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
      const emailContent = {
        subject: "Thank You @ Aashroy | Decoding Apocalypse",
        html: `<div
        style="
          text-align: center;
          font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande',
            'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
          background-color: #f1f1f1;
          height: 100vh;
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
          <h3>Thank you ${user.name},</h3>
          <p>
            Our Team at Aashroy is glad for your help and concern regarding the
            homeless situation in your locality. Your donation would be directly
            served to the NGOs for the betterment of the society.Every small
            donation helps us in helping thousands of people to get a better
            lifestyle and a home to call their own.
          </p>
          <p>Here is your transaction details of your donation</p>
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
            <h4>Name: ${user.name}</h4>
            <h4>Amount: &#8377;${donation.amount}</h4>
            <p>Date: ${new Date(donation.date).toLocaleDateString()}</p>
            <p>Transaction ID: ${donation.transactionID}</p>
          </div>
          <h4>Thank you,</h4>
          <h4>Team Aashroy</h4>
        </div>
      </div>`,
      };
      mailer(user.email, emailContent);
    } catch (err) {
      console.log(err);
      res.json({
        success: false,
        message: "Error Occured, Please try again",
      });
    }
  });

module.exports = router;
