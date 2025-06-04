// ------------------ dotenv setup (to use environment variables) ---------
const setupDotEnv = require("./setupenv.js");
setupDotEnv();

// ------------------ to connect with mongoDB -----------------------------
const connectToMongo = require("./db.js");
connectToMongo();

// /------------------------- importing required modules----------------------
const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5002;

// --------------- Integration of communication tools ------------------
const passport = require('passport');
const session = require('express-session');
const MicrosoftStrategy = require('passport-microsoft').Strategy;

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// --------------------------- Middleware setup ----------------------------
// to enable cross origin resource sharing
app.use(cors());

// to parse the body of request (specifically for post requests)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --------------------------- Routing setup -------------------------------
// importing routes files
const userRoutes = require("./Routes/user.route.js");
const serverRoutes = require("./Routes/server.route.js");
const integrationRoutes = require("./Routes/integration.route.js");
const grafanaRoutes = require("./Routes/grafana.route.js");
const apiFlowRoutes = require("./Routes/apiFlow.route.js");

// placing middlewares for router
app.use("/User",userRoutes);
app.use("/Server", serverRoutes);
app.use("/auth", integrationRoutes);
app.use("/grafana",grafanaRoutes);
app.use("/apiFlow", apiFlowRoutes);

// default routes
app.get("/", (req, res) => res.json({ signal: "green" }));


// -------------------------- Starting backend -----------------------------
app.listen(port, () => {
  console.log("backend is listening at port no : ", port);
});

// MONGO_URI='mongodb+srv://codewithnavneet:x6bvT0TNFGG8Lamv@pocket-vakil.wymv6m8.mongodb.net/?retryWrites=true&w=majority&appName=Pocket-Vakil'
