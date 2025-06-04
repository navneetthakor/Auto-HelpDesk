// to connect with server collection
const APIFlow = require("../../Models/APIFlow.model");
const createResponse = require("../../Response");

const wgetAPIFlow = async (req, res) => {
  try {
    console.log("Fired")
    // take params from url
    const {client_id, flow_id} = req.params;

    // not checking for client here 
    // but we can check if need araises in future 

    // retrive data from database
    const flow = await APIFlow.findById(flow_id);

    if(!flow){
        return res
        .status(200)
        .json(createResponse("", true, "Server Not Exists", 400, ""));
    }

    // return response
    console.log("respoindig fired event")
    return res.status(200).json(createResponse(flow, false, "", 200, ""));
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

module.exports = wgetAPIFlow;
