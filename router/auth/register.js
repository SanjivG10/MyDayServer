const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const {verifyUser} = require('./../../validate/validation')
const config = require('config')

const {user} = require('./../../models/users')
const nodemailer = require('nodemailer');

register = express()

register.post('/',  async (req,res)=>{

    if(!req.body)
    {
        return res.status(400).send({
            error: 'The user you are trying to sent is badly configured'
        })
    }

    const {error,value} = verifyUser(req.body); 

    if(error)
    {
        console.log(req.body)
        return res.header(400).send(error.details[0].message)
    }

    else if(!value)
    {
        return res.header(400).send("Unexpected Problem Encountered!")
    }

    const saltRounds = 10;

    bcrypt.genSalt(saltRounds, function(err, salt) {
        if(!err)
        {
            bcrypt.hash(req.body.password, salt, function(err, hash) {
                if(!err)
                {
                
                    const newUser = new  user({
                        username: req.body.username, 
                        password: hash, 
                        email: req.body.email, 
                        emailVerified: false 
                    })
                
                    newUser.save(function (err) {
                        if (err) {
                            
                            return res.status(400).send({
                                err: 'Database Error Occured '+err
                            })
                        }
                        else {
                            sendMail(res,req.body.email,value).catch((err)=>{
                                return res.header(400).send({
                                    err: 'Email cannot be sent! '+err
                                })
                            }); 

                            
                        }
                             
                      });
                }
                else{
                    return res.status(400).send({
                        err: 'Error generating Hash '+err
                    })
                }
            });
        }
        else{
            return res.status(400).send({
                err: 'Error generating Salt '+err
            })
        }

       
    });

})

register.get('/verifyToken',async (req,res)=>{
    const token  = req.query.token
    try {
    
      const decoded = await jwt.verify(token, 'email_server_jwt');
      console.log(decoded)
      user.findOne({email:decoded.email}).exec(function (err, theUser) {
  
        if(!err && theUser)
        {
           theUser.emailVerified=true
           theUser.save((err)=>{
            if (err) {
                return res.status(400).send({
                    err: 'Database Error Occured '+ err
                })
            }

            else {
                signTheUser(theUser); 
            }
        })
        }
        else{
            return res.status(400).send('Something went wrong. Your data is not found in database!')
        }
    });
      
    } catch(err) {
        
      return res.header(400).send({
          err
      })
    }  
  })

function signTheUser(theUser){
    jwt.sign( { theUser}, config.get('databaseSecret'),function (err,token){
        if(!err)
        {
            return res.header('x-auth-token',token).send({
                success: "SUCCESS"
            })
        }
        else{
            return res.header(400).send('Error Occured while Logging In', err)
        }
    } )
}

async function sendMail(res,email,value) {

    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: "bhairajagautam@gmail.com", 
            pass: "EMPTYFORNOW" 
        }
    });

    jwt.sign( 
        {
            exp: Math.floor(Date.now() / 1000) + (60 * 60),
            email:email
        },
        // change this here 
        'email_server_jwt',async function (err,token){
        if(!err)
        {
            await transporter.sendMail({
                from: '"MyDAY bhairajagautam@gmail.com', // sender address
                to: email, // list of receivers
                subject: 'Verify Your MyDay Email', // Subject line
                html: `
                    Congratulations! Your account has been successfully created. However, you need to verify that the given email is yours,
                    click the link below to verify your email address. 
                    <br />
                    <b> Remember that this token expires in an hour </b>
                    <br />
                    <a href="https://localhost:3000/register/verifyToken?token=${token}">https://localhost:3000/verifyToken?token=${token}</a>
                    `
            });
        
            return res.send({
                value:value
            })
        }
        else{
            return res.send('Error Occured while Logging In', err)
        }
    } )

    // send mail with defined transport object
    
}


module.exports.register = register; 