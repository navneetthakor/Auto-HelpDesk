// importing packages 
const User = require('../../Models/User.model');
const crypto = require('crypto');
const transporter = require('../../utils/myMailer');
const createResponse = require('../../utils/Response');


const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user by email
    // const user = await User.findOne({ email });
    // if (!user) {
    //   return res.status(404).json(createResponse("", true, "No account found with this email", 404, ""));
    // }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    // const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now (mili seconds)

    // Save token to user document
    // user.resetPasswordToken = resetToken;
    // user.resetPasswordExpires = resetTokenExpiry;
    // await user.save();

    // Construct reset URL
    const resetURL = `${process.env.FRONTEND_URL}/resetPassword/${resetToken}`;

    // Send email
    await transporter.sendMail({
      from: '"WebPulse Stack" <noreply@webpulsestack.com>',
      to: 'codewithnavneet@gmail.com',
      subject: 'Password Reset Request',
      html: `
        <h2>Password Reset</h2>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetURL}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
      `
    });

    res.status(200).json(createResponse("", true, "Password reset link sent", 200, ""));
  } catch (error) {
    res.status(500).json(createResponse("", true, error.message, 200, ""));
  }
};

module.exports = forgotPassword;