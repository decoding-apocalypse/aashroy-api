const mongoose = require("mongoose");

const DonationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  transactionID: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Donation", DonationSchema);
