// to connect with server collection
const Server = require("../../Models/Server.model");
const User = require("../../Models/User.model");
const createResponse = require("../../Response");
const axios = require('axios');


const pushServer = async (req, res) => {
  try {
    // check user exists or not
    const user = await User.findById(req.user.id);

    // if user is not present
    if (!user) {
      return res
        .status(200)
        .json(createResponse("", true, "User Not Exists", 400, ""));
    }

    // delete reccuring job
    const backendUrl = `${process.env.WORKER_POD_URL}/api/MasterPod/removeServer/${user._id}/${req.params.server_id}`
    const wsResponse = await axios.delete(backendUrl);

    if(wsResponse.data.IsErro){
      throw new Error("WorkerPod not responding");
    }

    // delete entry from database 
    const deletedServer = await Server.findByIdAndDelete(req.params.server_id);

    if(!deletedServer){
        return res
        .status(200)
        .json(createResponse("", true, "Server Not Exists", 400, ""));
    }

    // return response
    return res.status(200).json(createResponse(deletedServer, false, "Server deleted", 200, ""));
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

module.exports = pushServer;
