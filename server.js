const express=require("express")
const connection=require("./Config/db")
const {app}=require("./Routes/authRoute")
const {note} =require("./Routes/notesRoute")
require("dotenv").config()
const cors=require("cors")
const apps=express()

const PORT=process.env.PORT||8080

apps.use(express.json())
apps.use(cors())
apps.use("/auth",app)
apps.use("/notes",note)

apps.get("/",(req,res)=>{
    res.json({
        message:"Welcome to homepage"
    })
})

apps.listen(PORT,()=>{
        console.log(`App is listening on port ${PORT}`)
})