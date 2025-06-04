// to connect with server collection
const Server = require("../../Models/Server.model");
const User = require("../../Models/User.model");
const createResponse = require("../../Response");
const axios = require('axios');


const updateServer = async (req, res) => {
  try {
    // check user exists or not
    const user = await User.findById(req.user.id);

    // if user is not present
    if (!user) {
      return res
        .status(200)
        .json(createResponse("", true, "User Not Exists", 400, ""));
    }

    // updating data
    const oldData = await Server.findById(req.params.server_id);

    const data = req.body;
    const updatedData = {
        server_name: data.server_name ?? oldData.server_name,
        method: data.method ?? oldData.method,
        server_url: data.server_url ?? oldData.server_url,
        Headers: data.Headers ?? oldData.Headers,
        body: data.body ?? oldData.body,
        status: data.status ?? oldData.status,
        type_of_check: data.type_of_check ?? oldData.type_of_check,
        desired_response_time: data.desired_response_time ?? oldData.desired_response_time,
        check_frequency: data.check_frequency ?? oldData.check_frequency,
        keyword: data.keyword ?? oldData.keyword,
        status_codes: data.status_codes ?? oldData.status_codes,
    }

    //first delete reccuring job
    const backendUrl = `${process.env.WORKER_POD_URL}/api/MasterPod/removeServer/${user._id}/${req.params.server_id}`
    const wsResponse = await axios.delete(URL = backendUrl, Headers = {
      Accept: 'application/json'
    });

    if(wsResponse.data.IsErro){
      throw new Error("WorkerPod not responding");
    }

    //add new reccuring job
    // serverModal for workerPod
    const ServerModal = {
      // Client id (who owns this server)
      Client_id: user._id, // string
    
      // Server id (unique id for this server)
      Server_id: updatedData._id, // string
    
      // Flow id (used in alerting service) - optional
      flow_id: null, // string | null
    
      // Worker id
      Method: updatedData.method, // string
    
      // Server URL
      Server_url: updatedData.server_url, // string
    
      // Headers (simulating Dictionary<string, string>)
      Headers: updatedData.Headers, // Object (Dictionary in C#)
    
      // Body - optional
      Body: updatedData.body, // string | null
    
      // Status of the server (simulating ServerStatus enum)
      Status: updatedData.status, // string (R for Running, other statuses can be defined)
    
      // Type of check (simulating TypeOFCheck enum)
      typeOFCheck: updatedData.type_of_check, // string (GET, POST, etc.)
    
      // Check Frequency (simulating CheckFrequency enum)
      CheckFrequency: updatedData.check_frequency, // string (e.g., THRM for hourly)
    
      // Keyword to find or not find on the page
      Keyword: updatedData.keyword, // string | null
    
      // List of status codes which response can contain
      StatusCodes: updatedData.status_codes // Array of integers (e.g., [200, 404])
    };

    // making request to the worker server
    backendUrl = `${process.env.WORKER_POD_URL}/api/MasterPod/register`
    wsResponse = await axios.post(URL = backendUrl, Headers = {
      Accept: 'application/json'
    }, data = ServerModal);

    if(wsResponse.data.IsErro){
      throw new Error("WorkerPod not responding");
    }

    const updatedServer = await Server.findByIdAndUpdate(
        req.params.server_id,
        {$set : updatedData},
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

module.exports = updateServer;
