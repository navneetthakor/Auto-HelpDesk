const mongoose = require('mongoose');

const MTUserSchema = new mongoose.Schema({
  // Reference to the existing User model
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Make sure this matches your existing User model name
    required: true
  },
  microsoftId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  accessToken: String,
  refreshToken: String,
  displayName: String,
  email: String,
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('MTUser', MTUserSchema);