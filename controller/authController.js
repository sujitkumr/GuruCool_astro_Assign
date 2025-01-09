const ErrorResponse = require('../utils/errorResponse')
const User=require('../models/userModels');


exports.signUp= async (req,res,next)=>{
    const { email } = req.body;
    const userExist =await User.findOne({email});
    console.log('User exist:', userExist);
    if(userExist){
        return next(new ErrorResponse("Email already registred"));
    }
    try{
        const user =await User.create(req.body);
        res.status(201).json({
            success:true,
            user
        })
    }catch(error){
        next(error);
    }
}

exports.signIn= async(req,res,next)=>{
    try{
        const { email ,password}=req.body;
        if(!email){
            return next(new ErrorResponse("please add email"),40
            );
        }
        if(!password){
            return next(new ErrorResponse("Please entre password"),403);
        }
        const user=await User.findOne({email});
        if(!user){
            return next(new ErrorResponse("Invalid credentials"),400)
        }

        const isMatched=await user.comparePassword(req.body.password,user.password);
        if(!isMatched){
            return next(new ErrorResponse("Invalid credentials"),400);
        }
        res
        .status(200)
        .json({
            success:true,
            user
        })
    }catch(error){
        next(error);
    }
}

exports.logout = (req, res) => {
    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
};

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();

        if (!users || users.length === 0) {
            return next(new ErrorResponse("No users found", 400));
        }

        res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        next(error);
    }
};