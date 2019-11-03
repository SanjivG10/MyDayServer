const express = require('express')
const jwt = require('jsonwebtoken')

const {user,fbUser,googleUser,connectionDatabase} = require('./../models/users')
const {storySchema}  = require('./../models/storage')

query = express()

query.use(express.json())

async function verifyUser(req,res,next) {

  try {
    const decoded = await jwt.verify(req.body.token, config.get('DATABASE_SECRET'));
    const userToQuery = user
    if(decoded.theUser)
    {
      switch (decoded.theUser.type) {
        case "facebook":
          userToQuery=fbUser
          break;
        case "google":
          userToQuery=googleUser
          break;
        default:
          userToQuery = user
      }
    }

    userToQuery.findOne({username:decoded.theUser.username}).exec(function (err, myUser) {
      if(!err && myUser)
      {
        next()
      }
      else{
        return res.status(400).send({
          error:"Unknown Error Occured.Please try again later"
        })
      }
    })
   }

  catch(e)
  {
    console.log("VERIFICATION ERROR")
    return res.status(401).send({
      error:"Some Error Occured.Not authorized"
    })
  }

}


query.get('/myStories',async (req,res)=>{
    const storageDatabase = connectionDatabase.useDb('storage');
    const storyModel = storageDatabase.model('stories', storySchema);

    const cursor = await storyModel.find({ username:req.query.username });
    return res.send(cursor)
})

module.exports.query = query
