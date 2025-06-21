const nodemailer = require('nodemailer');

// Configure transporter (use environment variables for real projects)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS  // your email password or app password
  }
});

/**
 * Send booking confirmation email
 * @param {string} to - User's email
 * @param {string} name - User's name
 * @param {string} movieTitle - Movie title
 * @param {string} showtime - Date/time string
 * @param {string[]} seats - Array of seat names
 */
async function sendBookingConfirmation(to, name, movieTitle, showtime, seats) {
  const mailOptions = {
    from: `"bookMyMovie" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Your Movie Ticket is Confirmed!',
    html: `
      <h2>Hi ${name},</h2>
      <p>Your ticket for <b>${movieTitle}</b> has been <b>confirmed</b>!</p>
      <p><b>Showtime:</b> ${showtime}</p>
      <p><b>Seats:</b> ${seats.join(', ')}</p>
      <br/>
      <p>Enjoy your movie!</p>
      <hr/>
      <small>This is an automated email. Please do not reply.</small>
    `
  };
  await transporter.sendMail(mailOptions);
}

module.exports = { sendBookingConfirmation }; 