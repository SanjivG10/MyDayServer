const express = require('express')

const bcrypt = require('bcrypt')
const {verifyUser} = require('./../../validate/validation')

const {user} = require('./../../models/users')

register = express()



register.post('/facebook', async (req,res)=>{
    res.send('From Facebook Login!')
})

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
        return res.send(error.details[0].message)
    }

    else if(!value)
    {
        return res.send("Unexpected Problem Encountered!")
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
                        email: req.body.email 
                    })
                
                    newUser.save(function (err) {
                        if (err) {
                            return res.status(400).send({
                                err: 'Database Error Occured '+err
                            })
                        }
                        else {
                            return res.send({
                                msg: 'Success',
                                value
                            })
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
    


   

   

    // Joi validation done! Now we work in database part!
    
    // we are going to store password hash so we use bcrypt! 


})

module.exports.register = register; 