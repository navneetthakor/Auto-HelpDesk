// to connect with server collection
const APIFlow = require("../../Models/APIFlow.model");
const User = require("../../Models/User.model");
const createResponse = require("../../Response");

const getServer = async (req, res) => {
  try {
    // check user exists or not
    const user = await User.findById(req.user.id);

    // if user is not present
    if (!user) {
      return res
        .status(200)
        .json(createResponse("", true, "User Not Exists", 400, ""));
    }

    // retrive data from database
    const apiFlows = await APIFlow.find({user_id: user._id});

    if(!apiFlows){
        return res
        .status(200)
        .json(createResponse("", true, "No API exists", 400, ""));
    }

    // return response
    return res.status(200).json(createResponse(apiFlows, false, "", 200, ""));
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

module.exports = getServer;
