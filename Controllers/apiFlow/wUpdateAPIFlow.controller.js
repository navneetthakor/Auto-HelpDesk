// to connect with server collection
const APIFlow = require("../../Models/APIFlow.model");
const createResponse = require("../../Response");

const wgetAPIFlow = async (req, res) => {
  try {
    // take params from url
    const { client_id, flow_id } = req.params;

    // not checking for client here 
    // but we can check if need araises in future 

    // retrive data from database
    const flow = await APIFlow.findById(flow_id);

    // if flow not exists
    if (!flow) {
      return res
        .status(200)
        .json(createResponse("", true, "Server Not Exists", 400, ""));
    }

    // now start updating this flow

    // setting status to down
    flow.status = 'D';
    console.log(req.body);
  
    // update nodes
    flow.nodes.forEach((value, index, arr) => {      
      // first add status 
      if (Object.keys(req.body.Errors).includes(value.id)) {
        value.status = 'D';
        value.response.body = req.body.Errors[value.id];
      }
      else if (req.body.NodeResults[value.id]) {
        value.status = 'R';
        value.response.status = req.body.NodeResults[value.id].status;
        value.response.statusText = req.body.NodeResults[value.id].statusText;
        value.response.headers = req.body.NodeResults[value.id].headers;
        value.response.body = JSON.stringify(req.body.NodeResults[value.id].body);
      } else {
        value.status = 'N';
      }
    });
    

    flow.save();

    // return response
    return res.status(200).json(createResponse(flow, false, "", 200, ""));
  } catch (error) {
    console.log("updateAPIFlow error : ", error);
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
