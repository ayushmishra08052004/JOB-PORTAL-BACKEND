import {User} from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


export const register = async ( req, res ) => {
    try {
        const { fullname, email, password, phoneNumber, role } = req.body;
        if(!fullname || !email || !password || !phoneNumber || !role){
            return res.status(400).json({
                error: 'Some field is missing or invalid',
                success: false
            })
        }

        const user = await User.findOne({email});
        if(user) {
            return res.status(400).json({
                message: 'User already exists with this email',
                success: false
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role
        })

        res.status(201).json({
            message: 'User created successfully',
            success: true
        })

    }catch (e) {
        console.log(e, "User can not be created, something went wrong");
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

export const login = async ( req, res ) => {
    try {
        const { email, password, role } = req.body;
        if(!email || !password || !role){
            return res.status(400).json({
                message: 'Required field is missing or invalid',
                success: false
            })
        }
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                message: 'User does not exist with this email',
                success: false
            })
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if(!isPasswordMatched){
            return res.status(400).json({
                message: 'Incorrect password',
                success: false
            })
        }
        // check role
        if (role !== user.role){
            return res.status(400).json({
                message: 'Account does not exist with this role',
                success: false
            })
        }

        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET, {expiresIn: '1d'});

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
        }

        return res.status(200).cookie("token", token, { maxAge: 24 * 60 * 60 * 1000 , httpOnly: true, sameSite: true }).json({
            message: `User logged in successfully! welcome back ${user.fullname}`,
            success: true
        });

    }
    catch (e) {
        console.error("Login error:", e);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

export const logout = async ( req, res ) => {
    try {
        return res.status(200).cookie("token", '', {maxAge: 0}).json({
            message: 'User logged out successfully',
            success: true,
        });


    }catch (e) {
        console.log(e, "Logout error");
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

export const updateProfile = async ( req, res ) => {
    try {
        const {fullname ,email, phoneNumber, bio, skills  } = req.body;

        // const file = req.file;
        if(!fullname || !email || !phoneNumber || !bio || !skills){
            return res.status(400).json({
                message: 'Required field is missing or invalid',
                success: false
            })
        }

        const skillsArray = skills.split(',');
        const userId = req.id; // middleware authentication
        let user = await User.findById(userId)

        if(!user){
            return res.status(400).json({
                message: 'User does not exist with this email',
                success: false
            })
        }

        user.fullname = fullname;
        user.email = email;
        user.phoneNumber = phoneNumber;
        user.profile.bio = bio;
        user.profile.skills = skillsArray;

        await user.save()

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
        }

        res.status(200).json({
            message: 'Profile updated successfully',
            user,
            success: true
        })


    }catch (e){
        console.log(e, "User can not update profile");
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

