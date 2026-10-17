const userModel=require("../models/user.model")
const jwt=require("jsonwebtoken")
const emailService=require("../services/email.service")
const tokenBlackListModel=require("../models/blacklist.model")

async function userRegisterController(req,res){
    const{email,password,name}=req.body;

    const isExist=await userModel.findOne({
        email
    })

    if(isExist){
        return res.status(422).json({
            message:"User already exist with email!!",
            status:"Failed"
        })
    }
    const user=await userModel.create({
        email,
        password,
        name
    })

    const token=jwt.sign({userId:user._id},process.env.JWT_SECRET_KEY,{expiresIn:"3d"})
    res.cookie("token",token)
    res.status(201).json({
        user:{
            _id:user._id,
            email:user.email,
            name:user.name
        },
        token
    })

    await emailService.sendRegesterEmail(user.email,user.name)
}



async function userLoginController(req,res){
    const {email,password}=req.body;
    const user=await userModel.findOne({email}).select("+password")
    if(!user){
        return res.status(401).json({
            message:"Email or password is invalid"
        })
    }
    const isValidPassword=await user.comparePassword(password)

    if(!isValidPassword){
        return res.status(401).json({
        message:"Email or password is invalid"
        })
    }

    const token=jwt.sign({userId:user._id},process.env.JWT_SECRET_KEY,{expiresIn:"3d"})
    res.cookie("token",token)
    res.status(200).json({
        user:{
            _id:user._id,
            email:user.email,
            name:user.name
        },
        token
    })
}


async function userLogoutController(req,res){
    const token=req.cookies.token || req.headers.authorization?.split(" ")[1]
    if(!token){
        return res.status(200).json({
            message:"User logged out successfully"
        })
    }
    res.clearCookie("token")
                                   
    await tokenBlackListModel.create({
        token:token
    })

    res.status(200).json({
        message:"User logged out successfully"
    })


}

async function userProfileController(req,res){
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        res.status(200).json({
            user: {
                _id: user._id,
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error retrieving profile" });
    }
}

module.exports={
    userRegisterController,
    userLoginController,
    userLogoutController,
    userProfileController
}