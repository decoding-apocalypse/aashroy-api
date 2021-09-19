const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema({
  lat: {
    type: mongoose.Types.Decimal128,
    required: true,
  },
  lng: {
    type: mongoose.Types.Decimal128,
    required: true,
  },
});

module.exports = LocationSchema;
