const passport = require('passport');
const MicrosoftStrategy = require('passport-microsoft').Strategy;
const MTUser = require('../Models/MsTeams.model');

passport.use(new MicrosoftStrategy({
    clientID: process.env.MICROSOFT_CLIENT_ID,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL}/auth/teams/callback`,
    scope: ['user.read', 'offline_access', 'team.readbasic.all'],
    passReqToCallback: true // This allows us to access the request object
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      // Get userId from query parameter
      // const userId = req.user.id;
      const userId = "67cab90cd3e2657d48948fab";

      if (!userId) {
        return done(new Error('User ID is required'));
      }

      // Create or update MSTeams user entry
      const msTeamsUser = await MTUser.findOneAndUpdate(
        { microsoftId: profile.id },
        {
          userId: userId, // Store the existing User model's ID
          microsoftId: profile.id,
          accessToken,
          refreshToken,
          displayName: profile.displayName,
          email: profile._json.mail
        },
        { 
          upsert: true,  // Create if not exists
          new: true      // Return updated document
        }
      );
      
      return done(null, msTeamsUser);
    } catch (error) {
      return done(error);
    }
  }
));

// Serialization remains the same
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await MSTeamsUser.findById(id).populate('userId');
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;