// to use the express 
const fetchUser = require('../Middelwares/fetchUser.middelware.js');
const express = require('express');
const router = express.Router();

// importing middleware 

// importing controllers
const createTicket = require('../Controllers/ticket/createTicket.controller.js');

router.post("/createTicket", fetchUser, createTicket);


module.exports = router;