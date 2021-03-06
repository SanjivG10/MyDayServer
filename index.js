const express = require('express')
const helmet = require('helmet')

const {login} = require('./router/auth/login')
const {register} = require('./router/auth/register')
const {storage}  = require('./router/storage')
const {query} = require('./router/query')

const PORT = process.env.PORT || 3000

app = express()

app.set('view engine','pug')
app.set('views','./views')

app.use(express.json())
app.use(express.urlencoded({extended:true}));

app.use(express.static('uploads'))
app.use('/login/',login)
app.use('/register/',register)
app.use('/storage/',storage)
app.use('/query/',query)
// app.use('/register',register)
// app.use('/storage',storage)

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
  console.log(' RUNNING THE APP ')
})
