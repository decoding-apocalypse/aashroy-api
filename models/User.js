const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 8,
    },
    profileImg: {
      type: String,
      default: "",
    },
    donationList: {
      type: [mongoose.SchemaTypes.ObjectId],
      default: null,
    },
    uploadList: {
      type: [mongoose.SchemaTypes.ObjectId],
      default: null,
    },
    bio: {
      type: String,
      default: "",
    },
    dateOfBirth: {
      type: Date,
      default: () => new Date(2000, 0, 1),
    },
    phoneNo: {
      type: Number,
      default: null,
    },
    address: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
