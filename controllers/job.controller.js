import {Job} from "../models/job.model.js";
//admin posts job
export const postJob = async(req,res)=>{
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
        const userId = req.id;
        if(!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId){
            return res.status(400).json({
                message:"Job fields are required",
                success:false,
            })
        }
        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(','),
            salary: Number(salary),
            location,
            jobType,
            experience: Number(experience),
            position: Number(position),
            company: companyId,
            createdBy: userId,
        });

        return res.status(201).json({
            message:"Job created successfully",
            success:true,
            job:job
        })
    }   catch (error) {
        console.log(error);
        res.status(400).json({
            message: error.message,
            success: false
        })
    }
}
// for student
export const getAllJobs = async(req,res)=>{
    try {
        const keyword = req.query.keyword || ""
        const query = {
            $or:[
            {title: {$regex: keyword, $options: "i"}},
            {description: {$regex: keyword, $options: "i"}},
        ]
        }
        const jobs = await Job.find(query).populate({
            path: "company"
        }).sort({
            createdAt: -1
        });
        if(jobs.length === 0){
            return res.status(404).json({
                message:"Job not found",
                success:false
            })
        }
        return res.status(200).json({
            jobs:jobs,
            message:"Job found successfully",
            success:true,
        })
    }catch(err){
        console.log(err);
        res.status(400).json({
            message: "Internal Server Error",
            success: false
        })
    }
}
// for student
export const getJobById = async(req,res)=>{
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId);
        if(!job){
            return res.status(404).json({
                message:"Job not found",
                success:false
            })
        }
        return res.status(200).json({
            job:job,
            message:"Job found successfully",
            success:true,
        })
    }catch(err){
        console.log(err);
        res.status(400).json({
            message:"Job not found",
            success:false
        })
    }
}
// admin created jobs
export const getAdminJobs = async(req,res)=>{
    try {
        const adminId = req.id;
        const jobs = await Job.find({
            createdBy: adminId
        })
        res.status(200).json({
            jobs:jobs,
            message:"Job found successfully",
            success:true,
        })
    }catch(err){
        console.log(err);
        res.status(400).json({
            message:"Job not found, internal server Error",
            success:false
        })
    }
}
