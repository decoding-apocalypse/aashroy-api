// require('dotenv').config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// const apiKey = `${process.env.SENDGRID_API_KEY}`;
// console.log("SendGrid key ", apiKey)

const mailer = (to, emailContent) => {
  const msg = {
    to: to, // Change to your recipient
    from: "aakanksha.decoding.apocalypse@gmail.com", // Change to your verified sender
    subject: emailContent.subject,
    html: emailContent.html,
  };

  sgMail
    .send(msg)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });
};

module.exports = mailer;
