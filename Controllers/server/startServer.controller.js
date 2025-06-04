// to connect with server collection
const Server = require("../../Models/Server.model");
const User = require("../../Models/User.model");
const createResponse = require("../../Response");
const axios = require('axios');


const startServer = async (req, res) => {
  try {
    // check user exists or not
    const user = await User.findById(req.user.id);

    // if user is not present
    if (!user) {
      return res
        .status(200)
        .json(createResponse("", true, "User Not Exists", 400, ""));
    }

    const newServerData = await Server.findById(req.params.server_id);

    // for headers (here we have header as array but backend wants dictionary so)
    const headersObject = newServerData.Headers?.reduce((obj, item) => {
      obj[item.key] = item.values;
      return obj;
    }, {});

    //add new reccuring job
    // serverModal for workerPod
    const ServerModal = {
      // Client id (who owns this server)
      Client_id: user._id, // string
    
      // Server id (unique id for this server)
      Server_id: newServerData._id, // string
    
      // Flow id (used in alerting service) - optional
      flow_id: null, // string | null

      server_name: newServerData.server_name,
    
      // Worker id
      Method: newServerData.method, // string
    
      // Server URL
      Server_url: newServerData.server_url, // string
    
      // Headers (simulating Dictionary<string, string>)
      Headers: headersObject, // Object (Dictionary in C#)
    
      // Body - optional
      Body: newServerData.body, // string | null
    
      // Status of the server (simulating ServerStatus enum)
      Status: newServerData.status, // string (R for Running, other statuses can be defined)
    
      // Type of check (simulating TypeOFCheck enum)
      typeOFCheck: newServerData.type_of_check, // string (GET, POST, etc.)
    
      // Check Frequency (simulating CheckFrequency enum)
      CheckFrequency: newServerData.check_frequency, // string (e.g., THRM for hourly)
    
      // Keyword to find or not find on the page
      Keyword: newServerData.keyword, // string | null
    
      // List of status codes which response can contain
      StatusCodes: newServerData.status_codes // Array of integers (e.g., [200, 404])
    };

    // making request to the worker server
    backendUrl = `${process.env.WORKER_POD_URL}/api/MasterPod/register`
    wsResponse = await axios.post(backendUrl,ServerModal,{
      Accept: 'application/json'
    });

    if(wsResponse.data.IsErro){
      throw new Error("WorkerPod not responding");
    }

    // retrive data from database
    const updatedServer = await Server.findByIdAndUpdate(
        req.params.server_id,
        {$set : {status : 'R'}},
        {new :  true}
    );

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

module.exports = startServer;
