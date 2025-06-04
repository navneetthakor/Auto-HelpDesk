const mongoose = require('mongoose')

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: { 
    type: String, 
    default: "in_progress",
    enum:["in_progress","completed"] 
 },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
},
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  priority: { 
    type: String, 
    default: "medium",
    enum:["critical","medium","high","low"] 
 },
  deadline: Date,
  helpfulNotes: String,
  relatedSkills: [String],
  createdAt: { type: Date, default: Date.now },
});


const Ticket = mongoose.model('Ticket', ticketSchema)

module.exports = Ticket