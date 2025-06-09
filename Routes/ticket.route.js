import express from "express";
import { authenticate } from "../middlewares/auth.js";
import { createTicket, getTicket, getTickets } from "../controllers/ticket.js";

const router = express.Router();

router.post("/", fetchUser, getTickets);


export default router;