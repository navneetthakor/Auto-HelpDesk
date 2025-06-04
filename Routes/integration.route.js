const express = require('express');
const passport = require('../Config/passport');
const router = express.Router();
const fetchUser = require("../Middelwares/fetchUser.middelware");

/// Initiate Microsoft Teams authentication
router.get('/teams', (req, res, next) => {
    // Capture userId from query parameter
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
  
    // Store userId in session for callback
    req.session.userId = userId;
  
    // Proceed with authentication
    passport.authenticate('microsoft', { 
      prompt: 'select_account',
      state: userId // Pass userId as state
    })(req, res, next);
  });
  
  // Callback route after Microsoft authentication
  router.get('/teams/callback', 
    passport.authenticate('microsoft', { 
      failureRedirect: '/integration-failed' 
    }),
    (req, res) => {
      // Successful authentication, redirect to frontend
      res.redirect(`${process.env.FRONTEND_URL}/`);
    }
  );

  router.get('/teams/init', 
    fetchUser,  // Middleware to verify token
    (req, res) => {
      try {
        // Generate Microsoft Teams auth URL with user ID
        const authUrl = `/auth/teams?userId=${req.user.id}`;
  
        res.json({ 
          authUrl: `${process.env.BACKEND_URL}${authUrl}` ,
          signal: "green"
        });
      } catch (error) {
        res.status(500).json({ error: 'Authentication initialization failed', signal : 'red' });
      }
    }
  );
  
  module.exports = router;