const express = require("express");
const router = express.Router();
const uploadUserData = require("../models/Upload");

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
    res.status(201).json(uploadData);
  } catch (error) {
    res.json(error);
  }
});

// router.get("/:userId", async (req, res) => {
//   const particularUserData = await uploadUserData.find(req.params.userId);
//   console.log(req.session);
//   res.json(particularUserData);
//   // res.send(`Get request for upload ${req.body.userId}`);
// });

module.exports = router;
