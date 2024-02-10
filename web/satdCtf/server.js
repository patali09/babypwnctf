const http = require("http");
const express = require("express");
const app = express();


app.get("/", (req,res)=>{
	res.set({
        'Flag': 'i-CES{ResP0Nc3_H34D3R_AR3_IMP0RTAN7}',
      });
    res.sendFile("james.html",{root: __dirname });
})

app.get("/profile/5", (req,res)=>{
        res.status(200).json({name:"James Kettile", age:10, CreditCardNumber:123456789});
})
app.get("/profile/6", (req,res)=>{
    res.status(200).json({name:"I-CES Committee", age:15, CreditCardNumber:5481245487});
})

app.get("/profile/4", (req,res)=>{
    res.status(200).json({name:"Aarati Mahato", age:22, CreditCardNumber:321532181});
})


app.get("/profile/20", (req,res)=>{
    res.status(200).json({name:"i-CES{ID0E_CHALL3NG3_S0LV3D!}", age:10, CreditCardNumber:123456789});
})




app.post("/submit", (req,res)=>{
    res.status(200).json({message: 'Form submitted successfully'});
})



http.createServer(app).listen(3000);
