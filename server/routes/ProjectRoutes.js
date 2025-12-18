import express from 'express';
import {
    createProject,
    getAllProjects,
    getMyProjects,
    getProjectById,
    deleteProject,
    getPublicCompletedProjects
} from '../controllers/ProjectController.js';

import multer from 'multer';
import path from 'path';
import Project from '../models/projectModel.js';
import { auth } from '../middleware/AuthMiddleware.js';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Make sure this folder exists
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        // Allow .zip for zip fields, images for screenshots
        if (file.fieldname === 'screenshots') {
            // Accept images only
            if (!file.mimetype.startsWith('image/')) {
                return cb(new Error('Only image files are allowed for screenshots!'));
            }
        } else {
            if (path.extname(file.originalname) !== '.zip') {
                return cb(new Error('Only .zip files are allowed for zip fields!'));
            }
        }
        cb(null, true);
    }
});

const router = express.Router();

router.post('/create', upload.fields([
    { name: 'frontend', maxCount: 1 },
    { name: 'backend', maxCount: 1 },
    { name: 'envFile', maxCount: 1 },
    { name: 'dbFile', maxCount: 1 },
    { name: 'screenshots', maxCount: 10 }
]), createProject);
router.get('/all', getAllProjects);
router.get('/public/completed', getPublicCompletedProjects);
router.get('/my-projects/:id', getMyProjects);
router.get("/team/:teamId", async (req, res) => {
    try {
        console.log("TEAM ID : ", req.params.teamId);
        const project = await Project.findOne({ team: req.params.teamId });
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log("ERROR : ", error);
    }
});
router.get('/:id', getProjectById);
router.delete('/:userId/:projectId', deleteProject);

export default router;
