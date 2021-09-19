const mongoose = require("mongoose");
const LocationSchema = require("./Schema/LocationSchema");

const UploadSchema = new mongoose.Schema({
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  img: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  location: {
    type: LocationSchema,
    required: true,
  },
});

module.exports = mongoose.model("Upload", UploadSchema);
