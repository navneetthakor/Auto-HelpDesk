// to connect with collection in mongoDb 
const User = require('../../Models/User.model');
const createResponse = require('../../Response');

const updateUser = async (req,res) => {
    try{

        // find id of user
        const {user_id} = req.params;
        
        // find user 
        const user = await User.findById(user_id);
        if(!user){
            return res.status(401).json(createResponse("",true,"UserNot Exists",{}));
        }
            
        // return updated profile 
        return  res.json(createResponse("",false,"",user));
    }
    catch(e){
        console.log(e);
        return res.status(500).json({message: "internal error occured", signal: "red"});
    }
};

module.exports = updateUser;