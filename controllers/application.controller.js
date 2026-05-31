import {Application} from "../models/application.model.js";
import {Job} from "../models/job.model.js";

export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const  jobId  = req.params.id
        if(jobId === null){
           return res.status(400).json({
                message: 'Job is required',
                success: false
            })
        }
        // check if the user has already applied for this job
        const existingApplication = await Application.findOne({
            job: jobId,
            applicant: userId
        })
        if(existingApplication){
           return res.status(400).json({
                message: 'Application already exists',
                success: false
            })
        }
        // check if the job exists
        const existingJob = await Job.findById(jobId);
        if(!existingJob){
           return res.status(400).json({
               message: 'Job not found',
               success: false
           })
        }
        // create a new application
        const newApplication = await Application.create({
            job: jobId,
            applicant: userId
        })
        existingJob.application.push(newApplication._id);
        await existingJob.save();
        return res.status(201).json({
            message: 'Application created successfully',
            success: true,
            newApplication
        })


    }catch (error) {
        console.log(error);
        res.status(400).send({
            error: error
        })
    }
}


export const getAllApplications = async (req, res) => {
    try {
        const userId = req.id;
        const application = await Application.find({applicant: userId}).populate({
            path: 'job',
            options: {sort: {createdAt: -1}},
            populate: {
                path:"company",
                options: {sort: {createdAt: -1}}
            }
        }).sort({createdAt: -1});

        if(application.length === 0){
            return res.status(404).json({
                message: 'Application not found',
                success: false
            })
        }
        return res.status(200).json({
            applications: application,
            message: "All the applications found",
            success: true
        })

    }catch (error) {
        console.log(error);
        res.status(400).send({
            error: error
        })
    }
}

// for admin to get all the applicants
export const getApplicantById = async (req, res) => {
    try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
        path: "application",
        options: {sort: { createdAt: -1}},
        populate: {
            path: 'applicant'
        }
    });
    if(!job){
        return res.status(404).json({
            message: 'Job not found',
            success: false
        })
    }
    return res.status(200).json({
        job,
        success: true
    })
    }catch (error) {
        console.log(error);
        res.status(400).send({
            message: 'Applicants not found',
            success: false
        })
    }
}


export const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;
        if(!status){
           return  res.status(400).json({
                message: 'Status is required',
                success: false
            })
        }


        // find the applicatoin by applicant ID
        const application = await Application.findById(applicationId);
        if(!application){
            return res.status(400).json({
                message: 'Application not found',
                success: false
            })
        }
        // update status
        application.status = status.toLowerCase();
        await application.save();

        return res.status(200).json({
            message: 'Application updated successfully',
            success: true,
        })
    }catch (error) {
        console.log(error);
        res.status(400).send({
            error: error
        })
    }
}