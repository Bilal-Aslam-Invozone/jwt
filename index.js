const express=require("express");
const auth=require("./Routes/Auth")
const app=express();
app.use(express.json())
app.use("/auth",auth);

app.get('/',(req,res)=>{res.send("Hi I'm Working")})

app.listen(5000,()=>console.log("Server is running on 5000"))


