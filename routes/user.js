const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { OAuth2Client, UserRefreshClient } = require("google-auth-library");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const client = new OAuth2Client(process.env.GOOGLE_OAUTH_CLIENT_ID);

router.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/login", (req, res) => {
  console.log(req.session);
  if (req.session.user) {
    res.json({ isLoggedIn: true, user: req.session.user });
  } else {
    res.json({ isLoggedIn: false });
  }
});

// Register route
router.post("/register", async (req, res) => {
  const { name, email, password, passwordConf } = req.body;

  const username = email.split("@")[0];
  try {
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res.json({ message: "User already exist, please login" });
    }

    if (password !== passwordConf) {
      res.status(400).json({
        message: "Password and Confirm Password doesn't match",
      });
    }

    // hash the password and store
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await new User({
      name,
      email,
      password: hashedPassword,
      username,
    });
    const user = await newUser.save();
    req.session.user = user;
    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "24h" }
    );
    res.status(201).json({ ...user.toJSON(), token });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "Email not in our records" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "24h",
      }
    );
    req.session.user = user;
    return res.status(200).json({
      ...user.toJSON(),
      token,
    }); // Must never use the ._doc property
    // {
    //   ...user,
    //   succesfull: true,
    //   message: "Congratulations you are logged in",
    // }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Google login
router.post("/google", async (req, res) => {
  const { tokenId } = req.body;
  client
    .verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_OAUTH_CLIENT_ID,
    })
    .then(async (response) => {
      // console.log(res.payload);
      const { email, email_verified, name, picture, sub } = response.payload;
      if (email_verified) {
        try {
          const checkUser = await User.findOne({ email });
          if (checkUser) {
            const token = jwt.sign(
              {
                email: checkUser.email,
                id: checkUser._id,
              },
              process.env.JWT_SECRET_KEY,
              { expiresIn: "24h" }
            );
            req.session.user = checkUser;
            return res.status(200).json({ ...checkUser.toJSON(), token });
          } else {
            const username = email.split("@")[0];
            const password = sub;
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const newUser = await new User({
              username,
              email,
              password: hashedPassword,
              name,
              profileImg: picture,
            });

            const user = await newUser.save();
            req.session.user = user;
            const token = jwt.sign(
              { email: user.email, id: user._id },
              process.env.JWT_SECRET_KEY,
              { expiresIn: "24h" }
            );
            res.status(201).json({ ...user.toJSON(), token });
          }
        } catch (err) {
          res.status(500).json(err);
        }
      } else {
        return res.json({
          message: "You'r email id is not verified by Google",
        });
      }
    })
    .catch((err) => res.status(500).json(err));
});

router.post("/logout", (req, res) => {
  req.session.user = null;
  res.json({ successfull: true });
});

router.put("/:userId", async (req, res) => {
  const { userId } = req.params;
  const { name, profileImg, bio, dateOfBirth, phoneNo, address, password } =
    req.body;

  try {
    const existingUser = await User.findById(userId);
    const validPassword = password === existingUser.password;
    if (!validPassword) {
      return res.json({ message: "You aren't allowed to change the details" });
    }
    const user = await User.findByIdAndUpdate(
      userId,
      {
        name,
        profileImg,
        bio,
        dateOfBirth,
        phoneNo,
        address,
      },
      { new: true }
    );
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    res.json({ message: "error" });
  }
});

router.delete("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    await User.findByIdAndDelete(userId);
    res.json({ message: "The user deleted successfully" });
  } catch (err) {
    res.json({ err });
  }
});

module.exports = router;
