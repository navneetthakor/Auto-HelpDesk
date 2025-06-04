// to connect with server collection
const APIFlow = require("../../Models/APIFlow.model");
const Server = require("../../Models/Server.model");
const User = require("../../Models/User.model");
const createResponse = require("../../Response");
const axios = require('axios');


const startAPIFlow = async (req, res) => {
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
    const backendUrl = `${process.env.WORKER_POD_URL}/api/MasterPod/RegisterAPIFlow/${user._id}/${req.params.flow_id}`
    const wsResponse = await axios.post(
      backendUrl
    );

    if(wsResponse.data.IsError){
      throw new Error("WorkerPod not responding");
    }

    // retrive data from database
    const updatedServer = await APIFlow.findById(req.params.flow_id);


    // update node data 
    let nr = wsResponse.data.other;
    console.log(nr);
    updatedServer.nodes.forEach((value,index,arr) => value.status = 'R');

    updatedServer.status = 'R';

    updatedServer.nodes.forEach((value, index, arr) => {      
      // first add status 
      if (Object.keys(nr.errors).includes(value.id)) {
        value.status = 'D';
        value.response.body = nr.errors[value.id];
      }
      else if (nr.nodeResults[value.id]) {
        value.status = 'R';
        value.response.status = nr.nodeResults[value.id].status;
        value.response.statusText = nr.nodeResults[value.id].statusText;
        value.response.headers = nr.nodeResults[value.id].headers;
        value.response.body = JSON.stringify(nr.nodeResults[value.id].body);
      } else {
        value.status = 'N';
      }
    });
    await updatedServer.save();

    if(!updatedServer){
        return res
        .status(200)
        .json(createResponse("", true, "Server Not Exists", 400, ""));
    }

    // return response
    return res.status(200).json(createResponse(updatedServer, false, "Server started", 200, ""));
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

module.exports = startAPIFlow;
