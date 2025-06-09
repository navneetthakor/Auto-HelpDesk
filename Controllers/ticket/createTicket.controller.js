const Ticket = require('../../Models/Ticket.model')
const {inngest} = require('../../inngest/client')

const createTicket = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }
    const newTicket = Ticket.create({
      title,
      description,
      createdBy: req.user.id.toString(),
    });

    console.log("before inngest")
    console.dir(newTicket)
    await inngest.send({
      name: "ticket/created",
      data: {
        ticketId: (await newTicket)._id.toString(),
        title,
        description,
        createdBy: req.user.id.toString(),
      },
    });
    return res.status(201).json({
      message: "Ticket created and processing started",
      ticket: newTicket,
    });
  } catch (error) {
    console.error("Error creating ticket", error.message);
    console.log(error)
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = createTicket;