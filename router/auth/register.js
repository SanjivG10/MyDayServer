const express = require('express')
const jwt = require('jsonwebtoken')

const bcrypt = require('bcrypt')

const {verifyUser} = require('./../../validate/validation')
const config = require('config')
const {user} = require('./../../models/users')
const {sendMail} = require('./sendMail')

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
        return res.status(400).send(error.details[0].message)
    }

    else if(!value)
    {
        return res.status(400).send("Unexpected Problem Encountered!")
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

                    newUser.save( async function (err) {
                        if (err) {

                            return res.status(400).send({
                                err: 'Database Error Occured '+err
                            })
                        }

                        else {

                            try {
                                await sendMail(res,req.body.email,value)
                            } catch (error) {
                                return res.status(400).send({
                                    err: 'Email cannot be sent! '+err
                                })
                            }

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

      const decoded = await jwt.verify(token, config.get('EMAIL_SERVER'));

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
                signTheUser(res,theUser);
            }
        })
        }
        else{
            return res.status(400).send('Something went wrong. Your data is not found in database!')
        }
    });

    } catch(err) {

      return res.status(400).send({
          err
      })

    }
  })

function signTheUser(res,theUser){
    jwt.sign( { theUser}, config.get('DATABASE_SECRET'),function (err,token){
        if(!err)
        {
          
            return res.header('x-auth-token',token).send({
                success: "Success in email verification. Now you can log in."
            })
        }
        else{
            return res.status(400).send('Error Occured while Logging In', err)
        }
    } )
}


module.exports.register = register;
