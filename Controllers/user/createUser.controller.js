// to connect with user Collection 
const User = require('../../Models/User.model');

// to validate body params 
const {validationResult} = require('express-validator');

// to provide authtoken (for digital signature) 
const jwt = require('jsonwebtoken');

// to encrypt the password 
const bcrypt = require('bcryptjs');


const createUser = async(req,res) => {
    try{

        // checking the given parameters 
        const err =  validationResult(req);
        if(!err.isEmpty()){
            return res.status(400).json({error: err.array(), signal: "red"})
        }
    
        // check wheteher any User exists with provided email or not 
        let user = await User.findOne({email: req.body.email});
        if(user){
            return res.status(400).json({error: "user with given email already exists", signal: "red"});
        }
    
        // ------Now all set to create User ------
        // encrypt the password using bcrypt
        const salt = await bcrypt.genSaltSync(10);
        const securePas = await bcrypt.hashSync(req.body.password, salt);
        // creating and saving user in backend 

        // let imgPath = req.file.path.replace(/\\/g, '/');
        const newUser = new User({
            image: req.file ? req.file.path : "",
            username: req.body.username,
            email: req.body.email,
            password: securePas,
            contact_num: req.contact_num? req.contact_num : "",
        })
        newUser.save();
    
        // jsonwebtoken related 
        // to provide authentication token back to user 
        const data = {
            user: {
                id: newUser._id,
            }
        }
        const jwt_secret = process.env.JWT_SECRET;
        const usertoken = jwt.sign(data,jwt_secret);


        return res.json({usertoken: usertoken, signal: "green"});
    
        }catch(e){
            console.log(e);
            res.status(500).json({error: "some error occured", signal: 'red'});
        }
};

module.exports = createUser;