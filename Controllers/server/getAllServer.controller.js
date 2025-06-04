// to connect with server collection
const Server = require("../../Models/Server.model");
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
    const server = await Server.find({user_id: user._id});

    if(!server){
        return res
        .status(200)
        .json(createResponse("", true, "No server exists", 400, ""));
    }

    // return response
    return res.status(200).json(createResponse(server, false, "", 200, ""));
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
