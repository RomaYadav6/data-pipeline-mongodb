import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Route from "./routes/Metricroutes.js"
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
app.use(express.json()); // Middleware to parse JSON
let db;
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB via Mongoose'))
.catch(err => console.error('Mongoose connection error:', err));
app.use('/metrics',Route);
// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
