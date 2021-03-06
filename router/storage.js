const express = require('express')
const multer  = require('multer')
const fs = require('fs')
const {user,fbUser,googleUser,connectionDatabase} = require('./../models/users')
const {storySchema} = require('./../models/storage')
const jwt = require('jsonwebtoken')
const config  = require('config')

storage = express()


const storePlace = multer.diskStorage({
    destination: function (req, file, cb) {

    let filename = `./uploads/${req.body.storageOption}`

    function ensureDir(dirpath) {

        if (fs.existsSync(dirpath)) {
          return cb(null,dirpath)
        }

        else{
          try {
            fs.mkdirSync(dirpath, { recursive: true })
            return cb(null,dirpath)

          } catch (err) {

              return cb({
                  error:'The folder could not be created ' + err
              })
            }
        }
      }

    ensureDir(`${filename}/${req.body.username}`)

    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+'.jpg')
    }
  })

const upload = multer({
   storage:storePlace,
   fileFilter: (req,file,callback)=>{
    if(file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg') {
        return callback({
            error: 'Not a valid image!'
        })
    }
    callback(null, true)
   },
   limits : {
    fileSize : 1024*1024*5
   }
 }).single('avatar')


storage.use(express.json())

storage.post('/posts',async (req,res)=>{

    upload(req, res, async function (err) {

      const storageDatabase = connectionDatabase.useDb('storage');
      const storyModel = storageDatabase.model('stories', storySchema);

      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        console.log("MULTER ERROR ",err)

        return res.status(400).send({
            error: 'Unknown Error while uploading file '+ err
        })

      } else if (err) {

         console.log("THE ERRORRR ",err)
          return res.status(400).send({
              error: err.err
          })
        // An unknown error occurred when uploading.
      }

        if(!req.body.token)
        {
            return res.status(401).send({
              error:'You are not authorized to send data.'
            })
        }

        else{

          try {

            const decoded = await jwt.verify(req.body.token, config.get('DATABASE_SECRET'));

            let userToQuery = user
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
                if (req.body.storageOption=="stories")
                {
                  const image = req.file.path
                  const username = req.body.username
                  const caption = req.body.caption
                  const story = new storyModel({
                    story: image,
                    username,
                    caption
                  })

                  story.save((err)=>{
                    if(err)
                    {
                      return res.status(400).send({
                        error:'Database Error Occured'
                      })
                    }
                    else{
                      return res.send({
                        success:'SUCCESS'
                      })
                    }
                  })
                }

                else if(req.body.storageOption=="profile")
                {
                  user.findOne({username:req.body.username}).then((theUser)=>{

                    theUser.image = req.file.path

                    theUser.save((err)=>{
                      if(err)
                      {
                        return res.status(400).send({
                          error: "Database Error Occured"
                        })
                      }
                      else {
                        return res.send({
                          success: "SUCCESS"
                        })
                      }
                    })

                  }).catch((e)=>{
                    console.log("THE ERROR ",e)
                    res.status(400).send({
                      error: "Unknown Error Occured.Please Try Again Later!"
                    })
                  })
                }
              }
              else{
                  console.log("THE ERROR ",err)
                  return res.status(401).send({
                    error: 'You are not allowed to post ATM. Please try again later'
                  })
              }
          });

          } catch(error) {
            console.log("THE ERROR VALUE ",error)

            return res.status(400).send({
                error
            })
        }

      }
        //we save the content in database now!!

        // Everything went fine.
      })
})

module.exports.storage = storage
