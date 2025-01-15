import mongoose from "mongoose";


// By adding timestamps we automatilcaaly get the created at and updated at fields
const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    lastlogin:{
type:Date,
default:Date.now
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    resetPasswordToken:String,
    resetPasswordExpiresAt:Date,
    verficationToken:String,
    verficationTokenExpiresAt:Date,
},{timestamps:true})

export const User=mongoose.model('User',userSchema)
