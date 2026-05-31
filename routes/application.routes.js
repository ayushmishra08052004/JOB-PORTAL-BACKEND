import express from "express";
import {applyJob, getAllApplications, getApplicantById, updateApplicationStatus} from "../controllers/application.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {getJobById} from "../controllers/job.controller.js";

const router = express.Router();

router.get('/apply/:id', isAuthenticated, applyJob )
router.get('/get', isAuthenticated, getAllApplications)
router.get('/:id/applicants', isAuthenticated, getApplicantById)
router.post('/status/:id/update', isAuthenticated, updateApplicationStatus)

export default router;