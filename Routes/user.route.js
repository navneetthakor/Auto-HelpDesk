// to use the express 
const express = require('express');
const router = express.Router();

// to validate the given parameter in request 
const {body} = require('express-validator');

// to test cloudinary setup 
const upload = require('../Middelwares/fetchImages.middelware.js')

// importing middleware 
const fetchUser = require('../Middelwares/fetchUser.middelware.js');

// importing controllers
const createUser = require('../Controllers/user/createUser.controller.js');
const userLogin = require('../Controllers/user/userLogin.controller.js');
const userAuthtokenLogin = require('../Controllers/user/userAuthtokenLogin.controller.js');
const updateUser = require('../Controllers/user/updateUser.controller.js');
const forgotPassword = require('../Controllers/user/forgotPassword.controller.js');
const resetPassword = require('../Controllers/user/passwordReset.controller.js');
const getUserInfo = require('../Controllers/user/getUserInfo.controller.js')


// --------------------------ROUTE:1 create user account ----------------------------------------------------------
router.post('/createuser',
upload.single('image'),
[
    body("username", "please enter name").not().isEmpty(),
    body("email", "please enter valid email").isEmail(),
    body("password", "please enter password with minimum length of : 6").isLength({min:6})
],
createUser);

// --------------------------ROUTE:2 login to account (previous login not require) ----------------------------------------------------------
router.post('/userlogin',
[
    body("email", "please enter valid email").isEmail(),
    body("password", "please do enter your password").not().isEmpty()
],
userLogin);

// --------------------------ROUTE:3 login to accoutn with authtoken ( previous login not require) ----------------------------------------------------------
router.get('/userAuthtokenLogin', 
fetchUser , 
userAuthtokenLogin);

//  --------------------------Route:4 to update profile (login required) --------------------------
router.put('/updateUser',
fetchUser,
upload.single('image'),
updateUser);

// ------------------------- Route:5 to forgot password (send rest link) ----------------------------
router.post('/forgotPassword',
forgotPassword
);

// ------------------------- Route:6 to rest password (get token sent through email) ----------------------------
router.post('/resetPassword',
resetPassword
);

// -------------------------Route for Worker Pod to access user data-----------------------
router.put('/getUserInfo/:user_id',getUserInfo);

module.exports = router;