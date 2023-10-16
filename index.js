const express=require("express")
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const { Connection } = require("./connection/connect")
const { UserModel } = require("./models/UserModel");
const { authenticate } = require("./middleware/authenticate");
const { EmpModel } = require("./models/EmpModel");
var cors = require('cors')

const app=express()
app.use(express.json())
app.use(cors())

app.get("/",(req,res)=>{
    res.send("Base api")
})

// Signup and Login

app.post("/signup",(req,res)=>{
    const {email,password}=req.body
    bcrypt.hash(password, 5, async function   (err, hash) {
        // Store hash in your password DB.
        try{
       await UserModel.create({email,password:hash})
       res.send("User Registered")
        }catch(err){
            console.log(err)
            res.send("Error in registration")
        }
    });

})

app.post("/login",async(req,res)=>{
    const {email,password}=req.body
    const user= await UserModel.findOne({email:email})
    
    if(user){
    const hash=user.password
  
    bcrypt.compare(password, hash, function(err, result) {
        if(result){
            var token = jwt.sign({ userId:user._id }, 'shhhhh');
          res.send({msg:"welcome",token:token})
        }else{
            res.send("Wrong Password")
        }
    })
}else{
    res.send("Sign up first")
}
})


// Crud Part-----------------------------
app.use(authenticate)
app.get("/employee",async(req,res)=>{


const employee =await EmpModel.find()
res.send(employee)
})


app.post("/employee/add",async (req,res)=>{
    const {firstname,lastname,email,department,salary}=req.body
try{
await EmpModel.create({firstname,lastname,email,department,salary})
res.send("Employee data added")
}catch(err){
    console.log(err)
    res.send("Employee not added")
}

})

app.put("employee/:id",async(req,res)=>{
    const {userId}=req.query
    const id=req.params.id
    const {firstname,lastname,email,department,salary}=req.body

if(userId===id){
   try{
   await EmpModel.findByIdAndUpdate(id,{firstname,lastname,email,department,salary})
   res.send("Employee edited successfully")
      }catch(err){
      console.log(err)
       res.send("Employee not edited")
      }
    }else{
        res.send("Not Authorised")
    }
})

app.delete("employee/:id",async(req,res)=>{
const {userId}=req.query

    const id=req.params.id
    if(userId===id){
          try{
               await EmpModel.findByIdAnDelete(id)
               res.send("Employee deleted successfully")
             }catch(err){
                         console.log(err)
                         res.send("Employee not Deleted")
                        }
    }else{
        res.send("Not Authorized")
    }
})



app.listen(8080,async()=>{
    try{
      await Connection
      console.log("connected to 8080")
    }catch(err){
        console.log("Connection error")
    }
})
