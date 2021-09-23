const express = require("express");
const router = express.Router();
const uploadUserData = require("../models/Upload");
const User = require("../models/User");
const mailer = require("../utils/mailer");
const shortestDistance = require("../helper/shortestDistance");
const ngosData = require("../helper/ngosData");

router.get("/", async (req, res) => {
  try {
    const allUserData = await uploadUserData.find({});
    // console.log(req.session);
    res.json(allUserData);
  } catch (error) {
    res.json(error);
  }
});

router.post("/", async (req, res) => {
  const {
    userId,
    location,
    imgUrl: img,
    descrip: description,
    username,
  } = req.body;
  if (!location) {
    res.status(400);
    return res.json({
      error: "location is not there",
    });
  }
  if (!img) {
    res.status(400);
    return res.json({
      error: "imgUrl is not there",
    });
  }
  try {
    const user = await User.findById(userId);
    const newUploadUserData = await new uploadUserData({
      userId,
      username,
      location,
      img,
      description,
      date: new Date(),
    });
    const uploadData = await newUploadUserData.save();
    console.log(uploadData);
    // mail to NGO using algorithm
    const particularNgo = shortestDistance(ngosData.NGO, uploadData.location);
    // console.log(particularNgo);
    emailContent = {
      subject: "Homeless located @ Aashroy | Decoding Apocalypse",
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
          We have received the following update uploaded by Mr/Mrs ${user.name}
          regarding homeless people in your locality. The following details are
          true and same as
          <a href="https://aashroy.netlify.app/">uploaded in AASHROY.</a>
        </p>
        <p>Following are the details:</p>
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
          <h4>
            Location:<a
              href="https://www.google.com/maps/search/?api=1&query=${
                uploadData.location.lat
              },${uploadData.location.lng}"
            >
              Click here to visit the location
            </a>
          </h4>
          <h4>Description: ${uploadData.description}</h4>
          <p>Date: ${new Date(uploadData.date).toLocaleDateString()}</p>
          <div style="text-align: center">
            <img
              style="width: 90%"
              src=${uploadData.img}
              alt="Homeless"
            />
          </div>
        </div>

        <div>
          <p>The following details was uploaded by:</p>
          <p>Name: ${user.name}</p>
          <p>Email: ${user.email}</p>
          <p>Phone: ${user?.phoneNo}</p>
        </div>

        <h4>Thank you,</h4>
        <h4>Team Aashroy</h4>
      </div>
    </div>`,
    };
    const mailResponse = mailer(particularNgo.email, emailContent);
    console.log(mailResponse);
    res.status(201).json(uploadData);
  } catch (error) {
    res.json(error);
  }
});

router.get("/:userId", async (req, res) => {
  const particularUserData = await uploadUserData.findOne({
    userId: req.params.userId,
  });

  if (!particularUserData) {
    return res.json({
      error: "User not found",
    });
  }

  try {
    res.json(particularUserData);
  } catch (error) {
    res.json(error);
  }
});

module.exports = router;
