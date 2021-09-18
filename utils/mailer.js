// require('dotenv').config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// const apiKey = `${process.env.SENDGRID_API_KEY}`;
// console.log("SendGrid key ", apiKey)

const msg = {
  to: [
    "sayahnneetadutta@gmail.com",
    "vikas20_ug@cse.nits.ac.in",
    "jaymehta20_ug@cse.nits.ac.in",
    "pratik20_ug@cse.nits.ac.in",
  ], // Change to your recipient
  from: "aakanksha.decoding.apocalypse@gmail.com", // Change to your verified sender
  subject: "Sending with Decoding Apocalypse is Fun",
  text: "Hi! this is my first text",
  html: "<strong>Hi! Bitches</strong>",
};

sgMail
  .send(msg)
  .then((response) => {
    console.log(response[0].statusCode);
    console.log(response[0].headers);
  })
  .catch((error) => {
    console.error(error);
  });
