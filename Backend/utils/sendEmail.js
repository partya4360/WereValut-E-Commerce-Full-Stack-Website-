const nodemailer = require('nodemailer');

const sendEmail = async ({ email, subject, message }) => {
  const emailUser = process.env.EMAIL_USER || process.env.GMAIL_USER;
  const emailPass = process.env.EMAIL_PASS || process.env.GMAIL_PASS;

  if (!emailUser || !emailPass) {
    throw new Error('Email credentials are missing. Configure EMAIL_USER and EMAIL_PASS.');
  }
  if (!email) {
    throw new Error('Recipient email is missing.');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  await transporter.sendMail({
    from: `"WearValut Support" <${emailUser}>`,
    to: email,
    subject,
    html: message,
  });
  console.log(`Email successfully sent to ${email}`);
};

module.exports = sendEmail;