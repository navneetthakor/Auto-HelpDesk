// importing packages 
const User = require('../../Models/User.model');
const bcrypt = require('bcryptjs');
const createResponse = require('../../Response');

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json(createResponse("", true, "Invalid or expired reset token", 400, ""));
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user password and clear reset token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json(createResponse("", true, "Password reset successful", 400, ""));
  } catch (error) {
    res.status(500).json(createResponse("", true, error.message, 400, ""));
  }
};

module.exports = resetPassword