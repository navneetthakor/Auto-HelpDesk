// Example using MongoDB with Mongoose
// const User = require('../models/MsTeams.model');
const User = require('../Models/MsTeams.model');

async function saveUserToDatabase(userData) {
  try {
    // Find user by Microsoft ID or create new user
    const user = await User.findOneAndUpdate(
      { microsoftId: userData.microsoftId },
      userData,
      { 
        upsert: true,  // Create if not exists
        new: true      // Return updated document
      }
    );
    return user;
  } catch (error) {
    console.error('Error saving user:', error);
    throw error;
  }
}

async function getUserFromDatabase(userId) {
  try {
    const user = await User.findById(userId);
    return user;
  } catch (error) {
    console.error('Error retrieving user:', error);
    throw error;
  }
}

module.exports = {
  saveUserToDatabase,
  getUserFromDatabase
};