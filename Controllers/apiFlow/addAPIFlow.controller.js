// to connect with server collection
const APIFlow = require("../../Models/APIFlow.model");
const User = require("../../Models/User.model");
const createResponse = require("../../Response");
const { Error } = require("mongoose");
const axios = require('axios');


// used for deletion of APIFlow document from relation in case of any failure
let apiFlowId = -1;

const addAPIFlow = async (req, res) => {
  try {
    // check user exists or not
    const user = await User.findById(req.user.id);

    // if user is not present
    if (!user) {
      return res
        .status(200)
        .json(createResponse("", true, "User Not Exists", 400, ""));
    }

    // now add this entry to server modal
    const data = req.body;
    const newAPIFlow = new APIFlow({
      user_id: user._id,
      api_flow_name: data.api_flow_name,
      status: data.status,
      nodes: data.nodes,
      edges: data.edges,
      check_frequency: data.check_frequency
    });

    // save this entry
    await newAPIFlow.save();

    //set global id for server
    apiFlowId = newAPIFlow._id;

    const backendUrl = `${process.env.WORKER_POD_URL}/api/MasterPod/registerAPIFlow/${user._id}/${newAPIFlow._id}`
    let wsResponse = await axios.post(backendUrl)

    if (wsResponse.data.isError) {

      // delete this record 
      await APIFlow.findByIdAndDelete(apiFlowId);

      // return response
      return res.status(500).json(createResponse(wsResponse.data.errorMessage, true, "", 500, ""));
    }

    // update nodes
    let nr = wsResponse.data.other; //node result

    const flow = await APIFlow.findById(newAPIFlow._id);
    console.log(flow);
    console.log(wsResponse);

    flow.nodes.forEach((value, index, arr) => {
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

    flow.save();
    return res.status(200).json(createResponse(newAPIFlow, false, "", 200, ""));


  } catch (error) {
    console.log("AddAPIFlow error : ", error);
    // delete this record 
    if (apiFlowId > 0)
      await APIFlow.findByIdAndDelete(apiFlowId);
    return res.status(200).json(createResponse(
      "",
      true,
      error,
      500,
      ""
    ));
  }
};

module.exports = addAPIFlow;
