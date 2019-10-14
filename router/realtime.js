const express = require('express')
realtime = express()


realtime.use(express.json())


realtime.get('/',(req,res)=>{
    res.send('In Realtime Database router')
})

module.exports = realtime