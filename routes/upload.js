const express = require("express");
const router = express.Router();
const uploadUserData = require("../models/Upload");
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
    const particularNgoMailId = shortestDistance(ngosData.NGO, uploadData.location).email;
    console.log(particularNgoMailId);
    emailContent = {
      subject: "message from aashroy",
      html: `Hello 
              We have received the following update uploaded by Mr/Mrs ${uploadData.username} regarding homeless people in your <br>
              locality. The following details are true and same as uploaded in AASHROY.
              <br> <br>
              Homeless name: 
              Homeless location: ${uploadData.location}
              Age:
              Need any sort of medical attention: ${uploadData.desciption}
              Timestamp: ${uploadData.date}
              <br> <br>
              
              We here at AASHROY believe your organization would be the best place for the individual to get the best help
              and care he would require. Thanking you in advance for this noble pursuit.

              <br> <br>
              With regards,
              TEAM AASHROY`,
    };
    const mailResponse = mailer(particularNgoMailId, emailContent);
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
