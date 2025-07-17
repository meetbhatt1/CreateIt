import express from 'express'
import cors from "cors"
import morgan from 'morgan'
import colors from "colors"
import dotenv from "dotenv"
import AuthRoute from './routes/AuthRoute.js'
import ProjectRoutes from './routes/ProjectRoutes.js'
import DBConnection from './config/db.js'
dotenv.config()
import passport from 'passport'

DBConnection()

const app = express()
app.use(cors({
    origin: 'https://svn.createit.in', // React frontend
    credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use(passport.initialize());
app.get("/api", (req, res) => {
    res.json({ message: "API is working ✅" });
});
app.use('/api/auth', AuthRoute);
app.use('/api/projects', ProjectRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`.white.bgMagenta));