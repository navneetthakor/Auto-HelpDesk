// to connect with server collection
const Server = require("../../Models/Server.model");
const User = require("../../Models/User.model");
const createResponse = require("../../Response");
const axios = require('axios');


const wUpdateServer = async (req, res) => {
  try {
    // check user exists or not

    // skiping user validattion 
    // but can be added if need ariases 

    // retrive data from database
    const updatedServer = await Server.findByIdAndUpdate(
        req.params.server_id,
        {$set : {status : 'D'}},
        {new :  true}
    );

    if(!updatedServer){
        return res
        .status(200)
        .json(createResponse(updatedServer, true, "Server Not Exists", 400, ""));
    }

    // return response
    return res.status(200).json(createResponse(updatedServer, false, "Server pushed", 200, ""));
  } catch (error) {
    console.log("getServer error : ", error);
    return res.status(200).json(createResponse(
        "",
        true,
        error,
        500,
        ""
    ));
  }
};

module.exports = wUpdateServer;
