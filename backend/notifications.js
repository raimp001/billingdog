const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function sendTransactionNotification(to, icdCode, patientId, transactionHash) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Transaction Notification',
    text: `Transaction recorded:\nPatient ID: ${patientId}\nICD Code: ${icdCode}\nTransaction Hash: ${transactionHash}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

module.exports = { sendTransactionNotification };
