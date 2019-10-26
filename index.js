const express = require('express')
const helmet = require('helmet')
const httpsLocalhost = require("https-localhost")


const {login} = require('./router/auth/login')
const {register} = require('./router/auth/register')
const {storage}  = require('./router/storage')

const PORT = process.env.PORT || 3000

app = httpsLocalhost()

app.set('view engine','pug')
app.set('views','./views')

app.use(express.json())
app.use(express.urlencoded({extended:true}));

app.use(express.static('static'))
app.use('/login/',login)
// app.use('/register',register)
// app.use('/storage',storage)

app.use(helmet())

app.get('/',(req,res)=>{
  console.log("GETTING THE INITIAL HOME PAGE")
  return res.render('index',{title:"facebook",body:'hello'})
})

app.get('/home',(req,res)=>{
  return res.send({
    'hait':'hait'
  }) 
})

console.log("NODE JS DEPLOYEDDDDD")

app.listen(PORT,()=>{
  console.log(' RUNNING THE APP ')
})









