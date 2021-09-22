const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { OAuth2Client } = require("google-auth-library");
const mailer = require("../utils/mailer");
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
    const emailContent = {
      subject: "New Signin @ Aashroy | Decoding Apocalypse",
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
            <h3>Hey ${user.name},</h3>
            <p>
              Thank you for signing up with us. We work selflessly for the
              betterment of the lower section of the society with the help of
              generous persons like you.
            </p>
            <p>
              Here are the small things you can do to contribute to the society.
            </p>
            <ul>
              <li>
                Whenever you see a homeless person. Just visit the
                <a href="https://aashroy.netlify.app/upload">website</a> and upload
                the image of the person along with the location in the map
              </li>
              <li>
                If you happen to have extra stuffs (foods, clothes, medicines) in
                your home you would like to donate, visit
                <a href="https://aashroy.netlify.app/donation/stuffs">here</a> and
                place your order for donation. The nearby NGO will pickup your order
              </li>
              <li>
                You can donate some money
                <a href="https://aashroy.netlify.app/donation/money">here</a> which
                will be used in providing food and shelter to the needy ones.
              </li>
            </ul>
            <h4>Thank you,</h4>
            <h4>Team Aashroy</h4>
          </div>
        </div>`,
    };
    mailer(user.email, emailContent);
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
            const emailContent = {
              subject: "New Signin @ Aashroy | Decoding Apocalypse",
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
                    <h3>Hey ${user.name},</h3>
                    <p>
                      Thank you for signing up with us. We work selflessly for the
                      betterment of the lower section of the society with the help of
                      generous persons like you.
                    </p>
                    <p>
                      Here are the small things you can do to contribute to the society.
                    </p>
                    <ul>
                      <li>
                        Whenever you see a homeless person. Just visit the
                        <a href="https://aashroy.netlify.app/upload">website</a> and upload
                        the image of the person along with the location in the map
                      </li>
                      <li>
                        If you happen to have extra stuffs (foods, clothes, medicines) in
                        your home you would like to donate, visit
                        <a href="https://aashroy.netlify.app/donation/stuffs">here</a> and
                        place your order for donation. The nearby NGO will pickup your order
                      </li>
                      <li>
                        You can donate some money
                        <a href="https://aashroy.netlify.app/donation/money">here</a> which
                        will be used in providing food and shelter to the needy ones.
                      </li>
                    </ul>
                    <h4>Thank you,</h4>
                    <h4>Team Aashroy</h4>
                  </div>
                </div>`,
            };
            mailer(user.email, emailContent);
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
