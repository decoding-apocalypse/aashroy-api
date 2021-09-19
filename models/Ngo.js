const mongoose = require("mongoose");
const LocationSchema = require("./Schema/LocationSchema");

const NgoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: { type: String, required: true },
  address: { type: String, required: true },
  phoneNumber: { type: Number, required: true },
  location: {
    type: LocationSchema,
    required: true,
  },
});

module.exports = mongoose.model("Ngo", NgoSchema);
