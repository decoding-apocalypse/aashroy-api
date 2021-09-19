require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const PORT = process.env.PORT || 8800;

// Routes imports
const userRoutes = require("./routes/user");
const donationRoutes = require("./routes/donation");
const uploadRoutes = require("./routes/upload");
const paymentRoutes = require("./routes/payment");

const dbUrl = `mongodb+srv://decodingApocalypse:${process.env.MONGODB_PASS}@aashroy.za9ce.mongodb.net/aashroy?retryWrites=true&w=majority`;

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
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

const store = MongoStore.create({
  mongoUrl: dbUrl,
  secret: process.env.SESSION_SECRET,
  touchAfter: 24 * 60 * 60,
});

store.on("error", (e) => {
  console.log("SESSION STORE ERROR", e);
});

app.use(
  session({
    store,
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

app.use("/api/users", userRoutes);
app.use("/api/donation", donationRoutes);
app.use("/api/donation/money/payment", paymentRoutes);
app.use("/api/upload", uploadRoutes);

app.listen(PORT, () => {
  console.log(`SERVER LISTENING ON PORT ${PORT}`);
});
