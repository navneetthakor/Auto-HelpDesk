const { inngest } = require("../client.js");
const Ticket = require("../../Models/Ticket.model.js") ;
const { NonRetriableError } = require("inngest");
const analyzeTicket = require("../../utils/ai.js");

export const onTicketCreated = inngest.createFunction(
  { id: "on-ticket-created", retries: 2 },
  { event: "ticket/created" },
  async ({ event, step }) => {
    try {
      console.log("before step1")
      const { ticketId } = event.data;
      
      //fetch ticket from DB
      const ticket = await step.run("fetch-ticket", async () => {
        const ticketObject = await Ticket.findById(ticketId);
        if (!ticket) {
          throw new NonRetriableError("Ticket not found");
        }
        return ticketObject;
      });
      console.log("before step2")
      
      // classify ticket and get priority, relatedSkills etc.
      const tempTicket = { ...ticket }
      tempTicket.priority_rules = [
        {
          filter: 'contains',
          value: 'auth issue',
          priority: 'critical'
        },
        {
          filter: 'contains',
          value: 'required help',
          priority: 'low'
        },
      ]
      
      tempTicket.skills_array = ['react.js','next.js','jquery','auth','autodb','publish']
      const aiTicketClassificationResponse = await analyzeTicket(ticket);
      
      console.log("before ste3")
      const relatedskills = await step.run("ai-processing", async () => {
        let skills = [];
        if (aiTicketClassificationResponse) {
          await Ticket.findByIdAndUpdate(ticket._id, {
            priority: !["low", "medium", "high"].includes(aiTicketClassificationResponse.priority)
            ? "medium"
            : aiTicketClassificationResponse.priority,
            helpfulNotes: aiTicketClassificationResponse.helpfulNotes,
            status: "IN_PROGRESS",
            relatedSkills: aiTicketClassificationResponse.relatedSkills,
          });
          skills = aiTicketClassificationResponse.relatedSkills;
        }
        return skills;
      });
      console.log("before step4")

      // const moderator = await step.run("assign-moderator", async () => {
      //   let user = await User.findOne({
      //     role: "moderator",
      //     skills: {
      //       $elemMatch: {
      //         $regex: relatedskills.join("|"),
      //         $options: "i",
      //       },
      //     },
      //   });
      //   if (!user) {
      //     user = await User.findOne({
      //       role: "admin",
      //     });
      //   }
      //   await Ticket.findByIdAndUpdate(ticket._id, {
      //     assignedTo: user?._id || null,
      //   });
      //   return user;
      // });

      // await setp.run("send-email-notification", async () => {
      //   if (moderator) {
      //     const finalTicket = await Ticket.findById(ticket._id);
      //     await sendMail(
      //       moderator.email,
      //       "Ticket Assigned",
      //       `A new ticket is assigned to you ${finalTicket.title}`
      //     );
      //   }
      // });

      return { success: true };
    } catch (err) {
      console.error("❌ Error running the step", err.message);
      return { success: false };
    }
  }
);