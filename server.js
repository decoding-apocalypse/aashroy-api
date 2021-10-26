require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const path = require("path");
const PORT = process.env.PORT || 8800;

// Routes imports
const homeRoutes = require("./routes/home");
const userRoutes = require("./routes/user");
const donationRoutes = require("./routes/donation");
const uploadRoutes = require("./routes/upload");
const feedbackRoutes = require("./routes/feedback");
const paymentRoutes = require("./routes/payment");

const dbUrl = process.env.MONGO_URI;

mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use(
  session({
    key: "userId",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: 60 * 60 * 24,
    },
  })
);
app.use(cookieParser());
app.use(helmet());
app.use(morgan("common"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/", homeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/donation", donationRoutes);
app.use("/api/donation/payment", paymentRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/feedback", feedbackRoutes);

app.listen(PORT, () => {
  console.log(`SERVER LISTENING ON PORT ${PORT}`);
});
