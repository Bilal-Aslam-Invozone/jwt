const router = require("express").Router();
const {users}=require("../db");
const {check,validationResult}= require("express-validator");
const bcrypt=require("bcrypt");
const JWT=require("jsonwebtoken");


router.post('/signUp',[check("email", "Please Enter Valid Email").isEmail(), check("password","Please enter valid password that is greater than 6 charecter").isLength({min:6})],async(req,res)=>{
    const {password, email}=req.body;

    //VALIDATE THE INPUTS
    const errors=validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({
            errors:errors.array()
        })
    }
    console.log(`Password is ${password}  and your Email is ${email}`)
    

    //VALIDATE THE USER IF ALREADY EXIST IN DATABASE
    let user = users.find((user)=>user.email===email)
    // console.log(user);
    if(user)
    {
       return res.status(400).json({
            "errors":[
                {
                   "msg":"This user is already exist."
                }
            ]
        })
    }

       const hashedPassword= await bcrypt.hash(password,10)
       console.log(hashedPassword);
       users.push({
        email,
        password:hashedPassword
       })

       const token = await JWT.sign({
        email
       },"skjfijw345n3i45vdkj8drtn3oi434",{
        expiresIn:3600000
       })
   res.json(token);
})

router.post('/login', async(req,res)=>{
    const{email,password}=req.body;
    const user=users.find((user)=> user.email===email);
    if(!user)
    {
        return res.status(400).json({
            "msg":"Invalid Credentials"
        })
    }

    let isMatch= await bcrypt.compare(password,user.password)
    if(!isMatch)
    {
        return res.status(400).json({
            "msg":"Invalid Credentials"
        })
    }
    const token = await JWT.sign({
        email
       },"skjfijw345n3i45vdkj8drtn3oi434",{
        expiresIn:3600000
       })
   res.json(token);
})


router.get('/allUsers',(req,res)=>res.json(users))
module.exports=router;