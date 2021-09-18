const express = require("express");
const router = express.Router();

router
  .route("/")
  .get((req, res) => {
    res.json({
      name: "Pratik Majumdar",
      email: "info.pratikmajumdar@gmail.com",
    });
  })
  .post();

module.exports = router;
