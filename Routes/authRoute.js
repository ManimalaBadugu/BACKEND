const {Router}=require("express")
const {UserModel}=require("../Models/user.model")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")
require("dotenv").config()
const {authentication} =require("../Middlewares/authentication")
const {authorization}=require("../Middlewares/authorization")

const app=Router()

app.get("/",(req,res)=>{
    res.json({
        message:"Continue authentication"
    })
})

app.get("/v1/users/:id",authentication,async(req,res)=>{
    const id=req.params.id
    const particularUser =await UserModel.findOne({_id:id})

    if(!user){
        return res.status(500).json({
            message:"User not found.Please try again"
        })
    }
    return res.status(200).json({
        message:"Fetched successfully",
        user:user
    })
})

app.patch("/v1/update/:id",authentication,async (req,res)=>{
    const id=req.params.id
    const payload=req.body

    await UserModel.findByIdAndUpdate({_id:id},payload)
    try{
        res.status(200).json({
            message:"Updated successfully"
        })
    }
    catch(err){
        res.status(500).json({
            message:"Something went wrong",
            err:err
        })
    }
})

app.post("/v1/signup",async (req,res)=>{
    const {email,password}=req.body
    const checkEmail=await UserModel.findOne({email:email})
    if(!checkEmail){
        let hashedPassword=bcrypt.hashSync(password,6)
        if(!hashedPassword){
            return res.status(5000).json({
                message:"Something went wrong.Please try again later"
            })
        }
        else{
            const user=new UserModel({
                email,
                password:hashedPassword
            })
            try{
                await user.save()
                return res.status(201).json({
                    message:"SignedUp successfully"
                })
            }
            catch{
                res.status(500).json({
                    message:"Something went wrong.Please try again latter"
                })
            }
        }
    }
    else{
        return res.status(400).json({
            message:"Please choose another email"
        })
    }
})

app.post("/v1/login",async (req,res)=>{
    const {email,password}=req.body
    const user=await UserModel.findOne({email})
    if(!user){
        return res.status(400).json({
            message:"Invalid login credentials and try again later"
        })
    }
    const hashedPassword=user.password
    bcrypt.compare(password,hashedPassword,(err,result)=>{
        if(err){
            return res.status(500).json({
                message:"Something went wrong please try again latter"
            })
        }
        if(result){
            const token=jwt.sign({userId:user._id,email:user.email},process.env.SECRET_KEY)
            return res.status(200).json({
                message:"LoggedIn successfully",
                token:token
            })
        }
        else{
            return res.status(400).json({
                message:"Login failed.please signup if you don't have account"
            })
        }
    })
})


module.exports={app}