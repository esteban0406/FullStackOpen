 const express = require('express')

 const app = express()

 app.get('/', (req, res) =>{
    res.send("We start caremonda")
 })

 app.listen(5000,()=>{
    console.log("server in port 5000")
 })