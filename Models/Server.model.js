const mongoose = require('mongoose');
const {Schema} = mongoose;

const ServerSchema = new Schema({
    user_id : {
        type: mongoose.Schema.Types.ObjectId,  // Reference to User
        ref: 'User',
        required: true,
    },

    server_name: {
        type: String,
        required: true
    },

    method: {
        type: String,
        enum: ['GET','POST','PUT','DELETE'],
        required: true
    },

    server_url: {
        type: String,
        required: true
    },

    Headers: [
        {
            key: {
                type: String,
                required: true
            },
            values: {
                type: String,
                required: true
            }
        }
    ],

    body: {
        type: String,
    },

    status: {
        type: String,
        default: 'R',
        //R: Running, P: Pushed, 'D': Down
        enum: ['R', 'P', 'D'],
        required: true
    },

    type_of_check: {
        type: String,

        /*
            UBU: url becomes unavailable
            URHSCOT: url returns http status code other than
            UCK: url contains keyword
            UNCK: url not contains keyword
            URTGT: url response time greater then
        */
        enum: ['UBU', 'URHSCOT', 'UCK', 'UNCK', 'URTGT'],
        required: true
    },

    // if : 
    desired_response_time: {
        type: Number,
    },

    check_frequency: {
        type: String,

        /*
            TS : Thirty seconds
            FFS: fifty five seconds
            OM: one Minute
            TWOM: two minutes
            THRM: three minutes
            FIVM: five minutes
            TENM: ten minutes
            FIFM: fifteen minutes
            HAFH: half minutes
            OH: one Hours
        */
        enum: ['TS', 'FFS', 'OM', 'TWOM', 'THRM', 'FIVM', 'TENM', 'FIFM', 'HAFH', 'OH'],
        required: true
    },

    // keyword related operations
    keyword: {
        type: String,
    },

    //if status code requried then
    status_codes: [Number]

});

const Server = mongoose.model('Server', ServerSchema)

module.exports = Server