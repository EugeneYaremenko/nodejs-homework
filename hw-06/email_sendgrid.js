const sgMail = require("@sendgrid/mail");
const path = require("path");

require("dotenv").config({ path: path.join(__dirname, ".env") });

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: "yaremenko.e.s@gmail.com", // Change to your recipient
  from: "shystrik342@gmail.com", // Change to your verified sender
  subject: "Sending with SendGrid is Fun",
  text: "and easy to do anywhere, even with Node.js",
  html: "<strong>and easy to do anywhere, even with Node.js</strong>",
};

async function main() {
  const result = await sgMail.send(msg);
  console.log(result);
}

main();
