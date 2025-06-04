// to connect with server collection
const APIFlow = require("../../Models/APIFlow.model");
const createResponse = require("../../Response");
const User = require("../../Models/User.model");

const wgetAPIFlow = async (req, res) => {
    try {

        // check user exists or not
        const user = await User.findById(req.user.id);

        // if user is not present
        if (!user) {
            return res
                .status(200)
                .json(createResponse("", true, "User Not Exists", 400, ""));
        }


        // retrive data from databasereq.params.server_id
        const flow = await APIFlow.findById(req.params.flow_id);

        if (!flow) {
            return res
                .status(200)
                .json(createResponse("", true, "Server Not Exists", 400, ""));
        }

        // return response
        return res.status(200).json(createResponse(flow, false, "", 200, ""));
    } catch (error) {
        console.log("getAPIFlow error : ", error);
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
