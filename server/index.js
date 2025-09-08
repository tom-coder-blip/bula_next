//This is where the server starts, Express is configured, 
// middleware is applied, and routes are registered.

import express from 'express';
import path from "path";
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import matchingRoutes from './routes/matching.routes.js';
import matchRequestRoutes from './routes/matchrequest.routes.js';
import mentorRoutes from './routes/mentor.routes.js';
import qaRoutes from './routes/qa.routes.js';
import chatRoutes from './routes/chat.routes.js';
import careerRoutes from './routes/Career.routes.js';  
import skillsRoutes from './routes/skills.routes.js';
import goalRoutes from './routes/goal.routes.js';
import cors from 'cors'; //middleware for cross origin request sharing


// Load env vars
dotenv.config({ path: path.resolve("server/.env") })

console.log("✅ EMAIL_USER:", process.env.EMAIL_USER);
console.log("✅ EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded" : "Missing");

const app = express(); //app is the main server application.
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.send("🚀 BulaNext Backend is running!");
});

// Routes mounting API endpoints
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/match', matchingRoutes);
app.use('/api/match-request', matchRequestRoutes);
app.use('/api/mentor', mentorRoutes);
app.use("/uploads", express.static(path.join(process.cwd(), "/uploads"))); // to serve uploaded files
app.use('/api/qa', qaRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/goals', goalRoutes);

// DB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch(err => console.error('DB connection failed:', err));