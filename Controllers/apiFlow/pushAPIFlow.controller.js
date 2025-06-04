// to connect with server collection
const APIFlow = require("../../Models/APIFlow.model");
const User = require("../../Models/User.model");
const createResponse = require("../../Response");
const axios = require('axios');


const pushAPIFlow = async (req, res) => {
  try {
    // check user exists or not
    const user = await User.findById(req.user.id);

    // if user is not present
    if (!user) {
      return res
        .status(200)
        .json(createResponse("", true, "User Not Exists", 400, ""));
    }

    // making request to the worker server
    const backendUrl = `${process.env.WORKER_POD_URL}/api/MasterPod/removeAPIFlow/${user._id}/${req.params.flow_id}`
    const wsResponse = await axios.delete( backendUrl);

    if(wsResponse.data.IsError){
      throw new Error("WorkerPod not responding");
    }

    // retrive data from database
    const updatedServer = await APIFlow.findByIdAndUpdate(
        req.params.flow_id,
        {$set : {status : 'P'}},
        {new :  true}
    );

    if(!updatedServer){
        return res
        .status(200)
        .json(createResponse("", true, "Server Not Exists", 400, ""));
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

module.exports = pushAPIFlow;
