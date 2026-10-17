const mongoose=require("mongoose");
const bcrypt=require("bcrypt");


const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:[true,"Email is requuired for creating a user!!"],
        trim:true,
        lowercase:true,
        match:[ /^[^\s@]+@[^\s@]+\.[^\s@]+$/,"Invalid Email address!!!"],
        unique:[true,"Email already exists!!!"]
    },
    name:{
        type:String,
        required:[true,"Name is required for creating an account"]

    },
    password:{
        type:String,
        required:[true,"Password is required for creating an account"],
        minlength:[6,"password should be contain atleast 6 character!"],
        select:false
    },
    systemUser:{
        type:Boolean,
        default:false,
        immutable:true,
        select:false
    }
},{
    timestamps:true
})

userSchema.pre("save",async function(){
    if(!this.isModified("password")){
        return 
    }
    const salt=await bcrypt.genSalt(10);
    const hash=await bcrypt.hash(this.password,salt)
    this.password=hash;
    return
})

userSchema.methods.comparePassword=async function(password){
    return await bcrypt.compare(password,this.password)
}

const userModel=mongoose.model("user",userSchema)

module.exports=userModel