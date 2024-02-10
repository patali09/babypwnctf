const express = require("express")
const path = require("path")
const app = express();


const port = 3000

app.get("/", (req, res)=>{
    res.sendFile(path.join(__dirname, '404.html'));
})

app.get("/hiddenpage.html", (req, res)=>{
    res.sendFile(path.join(__dirname, '/hiddenpage.html'));
})

app.listen(port);

