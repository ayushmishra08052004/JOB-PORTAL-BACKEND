import express from 'express';
import {postJob, getAllJobs,getJobById,getAdminJobs} from "../controllers/job.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.post("/post", isAuthenticated,postJob);
router.get("/get", isAuthenticated,getAllJobs);
router.get('/get/admin', isAuthenticated, getAdminJobs);

router.get('/get/:id', isAuthenticated,getJobById);

export default router;