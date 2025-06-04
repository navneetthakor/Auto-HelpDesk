// creating express router object
const express = require('express');
const router = express.Router();

// importing middleware
const fetchUser = require('../Middelwares/fetchUser.middelware');

// importing controllers 
const addServer = require("../Controllers/server/addServer.controller.js");
const getServer = require("../Controllers/server/getServer.controller.js");
const pushServer = require("../Controllers/server/pushServer.controller.js");
const deleteServer = require("../Controllers/server/deleteServer.controller.js");
const updateServer = require("../Controllers/server/updateServer.controller.js");
const wUpdateServer = require("../Controllers/server/wUpdateServer.controller.js");
const startServer = require("../Controllers/server/startServer.controller.js");
const getAllServer = require("../Controllers/server/getAllServer.controller.js")

// -------------------- Route:1 adding server ---------------
router.post('/addServer',fetchUser, addServer);

// ------------------- Route:2.1 get all servers list ---------------
router.get('/getAllServer',fetchUser,getAllServer);

// -------------------- Route:2.2 get seerver info ------------
router.get('/getServerInfo/:server_id',fetchUser, getServer);

// -------------------- Route: 3 push server -------------
router.put('/pushServer/:server_id', fetchUser, pushServer);

// -------------------- Route: 4 remove server -----------
router.delete('/deleteServer/:server_id', fetchUser, deleteServer);

// ------------------- Route: 5 update server ---------
router.put('/updateServer/:server_id', fetchUser, updateServer);

// ------------------- Route: 6 update server ---------
router.put('/startServer/:server_id', fetchUser, startServer);

// ---------------------------- Worker pod routes ----------
router.put('/pushServer/:client_id/:server_id',wUpdateServer);

module.exports = router;