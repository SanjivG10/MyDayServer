const express = require('express')
const helmet = require('helmet')
const httpsLocalhost = require("https-localhost")
const jwt = require('jsonwebtoken')


const {login} = require('./router/auth/login')
const {register} = require('./router/auth/register')
const {user} = require('./models/users')
const {storage}  = require('./router/storage')

PORT = process.env.PORT || 3000

app = httpsLocalhost()

app.set('view engine','pug')
app.set('views','./views')

app.use(express.json())
app.use(express.urlencoded({extended:true}));

app.use(express.static('static'))
app.use('/login/',login)
app.use('/register',register)
app.use('/storage',storage)

app.use(helmet())

app.get('/',(req,res)=>{
  return res.render('index',{title:"facebook",body:'hello'})
})

app.get('/home',(req,res)=>{
  return res.send({
    'hait':'hait'
  }) 
})



app.listen(PORT,()=>{
  console.log(' RUNNING WITH HTTPs ')
})









