const express = require('express')
const jwt = require('jsonwebtoken')

const bcrypt = require('bcrypt')

const {verifyUser} = require('./../../validate/validation')
const config = require('config')
const {user} = require('./../../models/users')

register = express()

register.post('/',  async (req,res)=>{

    if(!req.body)
    {
        return res.status(400).send({
            error: 'The user you are trying to sent is badly configured'
        })
    }

    if(req.body.email) {
      req.body.email = req.body.email.toLowerCase();
    }
    else if (req.body.username)  {
      req.body.username = req.body.username.toLowerCase();
    }

    const {error,value} = verifyUser(req.body);


    if(error)
    {
      return res.status(400).send( {
        error: error.details[0].message
      })
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

                  user.findOne({username:req.body.username})
                    .then((userNew) => {
                      if (!userNew) {

                        const newUser = new  user({
                            username: req.body.username,
                            password: hash,
                            email: req.body.email,
                        })

                        newUser.save( async function (err) {
                            if (err) {

                                return res.status(400).send({
                                    error: 'Database Error Occured '
                                })
                            }

                            else {
                              return res.send({
                                success: "SUCCESS",
                                token: "HELLO"
                              })
                              // signTheUser(res,newUser)
                            }

                          });
                      }
                      else {
                        res.status(400).send({ error: 'Username is already taken'});
                      }
                    })
                    .catch((err) => {
                      console.log("THE ERROR ",err)
                        return res.status(400).send({
                            error: 'Database Error Occured '
                        })
                      });

                }
                else{
                    return res.status(400).send({
                        error: 'Error generating Hash '+err
                    })
                }
            });
        }
        else{
            return res.status(400).send({
                error: 'Error generating Salt '+err
            })
        }

    });

})

function signTheUser(res,theUser){
    jwt.sign( { theUser}, config.get('POST_SECRET'),function (err,token){

        if(!err)
        {
            return res.send({
                success: "SUCCESS",
                token
            })
        }
        else{
            return res.status(400).send('Error Occured Verifying Email ', err)
        }
    } )
}

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
                    error: 'Database Error Occured '+ err
                })
            }

            else {
                signEmail(res,theUser);
            }
        })
        }
        else{
            return res.status(400).send('Something went wrong. Your data is not found in database!')
        }
    });

    } catch(error) {

      return res.status(400).send({
          error
      })

    }
  })

function signEmail(res,theUser){
    jwt.sign( { theUser}, config.get('DATABASE_SECRET'),function (err,token){
        if(!err)
        {
            return res.send({
                success: "Success in email verification. Now you can log in."
            })
        }
        else{
            return res.status(400).send('Error Occured Verifying Email ', err)
        }
    } )
}


module.exports.register = register;
