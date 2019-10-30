const express = require('express')
const jwt = require('jsonwebtoken')
const config = require('config')
const Joi = require('joi')
const {OAuth2Client} = require('google-auth-library');

const bcrypt = require('bcrypt')
const fetch = require('node-fetch')

const {user,fbUser,googleUser} = require('../../models/users')
const {checkVerifyAuth} = require('./checkLogin')
const {sendMail} = require('./sendMail')

login = express()

function signTheUser(res,theUser){
    jwt.sign( { theUser}, config.get('DATABASE_SECRET'),function (err,token){
        if(!err)
        {
            return res.header('x-auth-token',token).send({
                success: "SUCCESS"
           })
        }
        else{
            return res.status(400).send('Error Occured while Logging In', err)
        }
    })
}

login.post('/',  async (req,res)=>{

    if(!req.body)
    {
        return res.status(400).send({
            error: 'The user you are trying to sign in is badly configured'
        })
    }


    if(req.body.sendMail)
    {

      try {
        await sendMail(res,req.body.email,req.body)

      } catch (e) {
        return res.status(400).send({
            error: 'Email cannot be sent! '+ e.message
        })
      }

    }

    Object.keys(req.body).map( (k) => {

        req.body[k] = req.body[k].trim()

    });



    if(req.body.email) {
      req.body.email = req.body.email.toLowerCase();
    }
    else if (req.body.username)  {
      req.body.username = req.body.username.toLowerCase();
    }

    const {error,value} = verifyUser(req.body);

    console.log(error,value)

    if(error)
    {
        return res.status(400).send( {
          error: 'Invalid Username or Password.'
        })
    }

    else if(!value)
    {
        return res.status(400).send({
          error:"Unexpected Problem Encountered!"
        })
    }

    // here we compare the password with the hash and if it goes all right, we will improve!

    // query database with given email or username.. since I the Great would want username to be that good, lets go username wise !
    let queryParam = {}
    if(req.body.username)
    {
        queryParam.username = req.body.username
    }
    else{
        queryParam.email = req.body.email
    }

    user.findOne(queryParam).exec(function (err, theUser) {
        if(!err && theUser)
        {

            bcrypt.compare(req.body.password, theUser.password, function(err, valid) {
                if(err)
                {
                    return res.status(400).send({
                        error: 'Password could not be hashed ' + err
                    })
                }

                if (valid)
                {
                    signTheUser(res,theUser);
                }

                else{
                    return res.status(400).send({
                        error: 'Password do not match. Make sure you type correctly!'
                    })
                }
            });

        }
        else{
            console.log("USER NOT FOUND")
            return res.status(400).send({
                error: 'Invalid Username or Password'
            })
        }
    });

})

login.post('/facebook',async(req,res)=>{

    if(req.body)
    {

      const userID = req.body.userID
      const access_token = req.body.accessToken
      const app_id = config.get('FACEBOOK_APP_ID')
      const app_secret = config.get('FACEBOOK_APP_SECRET')
      const image = req.body.image
      const email = req.body.email
      const URL = `https://graph.facebook.com/debug_token?input_token=${access_token}&access_token=${app_id}|${app_secret}`

      async function verifyAndSave()
      {
          await fetch(URL)
          .then(response => response.json())
          .then(json =>
              {


                  if(json.data.is_valid)
                  {
                      fbUser.findOne({fbID:userID}).exec(function(err,theUser){

                          if(!err && theUser )
                          {

                              signTheUser(res,theUser);
                          }

                          else {

                              const username =  json.data.user_id

                              const newUser = new fbUser({
                                  fbID: userID,
                                  accessToken : access_token,
                                  image :  image||'',
                                  username : username,
                                  email: email
                              })

                              newUser.save((err)=>{
                                  if (err) {
                                      return res.status(400).send({
                                          error: 'Database Error Occured '+err
                                      })
                                  }

                                  else {
                                      signTheUser(theUser);
                                  }
                              })
                              // lets create user in our database
                          }
                      })
                  }
                  else {
                      return res.status(400).send({
                          error:'Access token is not valid!'
                      })
                  }


              }
          ).catch((err)=>{
              return res.status(400).send({
                  error: "Access Token could not be authorized "+ err
              })
          });
      }

      verifyAndSave()
      // verify the token here by calling the graph, if response is good, then it is good!
    }

    else{
        return res.status(400).send({
            error: 'Nothing Received!'
        })
    }
})


login.post('/google',async (req,res)=>{
    if(req.body)
    {
        if (req.body.id_token){

            const id_token = req.body.id_token

            const clientID = config.get('GOOGLE_CLIENT_ID')
            const client = new OAuth2Client(clientID);

            async function verifyAndSave() {

                try{

                    const ticket = await client.verifyIdToken({
                        idToken: id_token,
                        audience: clientID
                    });

                    const payload = ticket.getPayload();
                    const googleID = payload.sub
                    const image = payload.picture
                    const name  = payload.given_name|| '' + payload.family_name|| ''
                    const username = name + googleID

                    googleUser.findOne({googleID:googleID}).exec(function(err,theUser){
                        if(!err && theUser )
                        {
                            signTheUser(res,theUser);
                        }

                        else {
                            const newUser = new googleUser({
                                id_token: id_token,
                                googleID : googleID,
                                image :  image,
                                username: username
                            })

                            console.log("NEW USER MAKING ")

                            newUser.save((err)=>{
                                if (err) {
                                    return res.status(400).send({
                                        error: 'Database Error Occured '+err
                                    })
                                }

                                else {
                                    signTheUser(res,newUser);
                                }
                            })
                            // lets create user in our database
                        }
                    })

                }

                catch(error)
                {
                  console.log("SENDING ERROROROROROR ",error)
                    return res.status(400).send({
                        error
                    })
                }
                // If request specified a G Suite domain:
                //const domain = payload['hd'];
            }


            verifyAndSave()

        }
        else {
            return res.status(400).send({
                error: 'No return value from the Google!'
            })
        }
    }

    else{
        return res.status(400).send({
            error: 'Nothing Received!'
        })
    }
})

login.post('/verifyAuth',checkVerifyAuth,async (req,res)=>{
    try {
        const decoded = await jwt.verify(req.body.token, config.get('DATABASE_SECRET'));
        // lets show him last login here than previous place!
        return res.send({
            user: decoded,
            success: 'success',
        })
      } catch(error) {

        return res.status(400).send({
            error
        })
      }
})


function verifyUser (user){
    const schema = Joi.object({
        username: Joi.string()
            .required()
            .alphanum()
            .min(4)
            .max(30),
        password: Joi.string()
            .min(6)
            .required()
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/),
        email: Joi.string()
            .email({ minDomainSegments: 2 })
    })

   return schema.validate({
        username: user.username,
        password: user.password,
        email: user.email
        })
}


module.exports.login = login;
