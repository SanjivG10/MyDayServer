const express = require('express')
const multer  = require('multer')
const fs = require('fs')

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

storage.post('/posts',(req,res)=>{
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
          // A Multer error occurred when uploading.
          return res.status(400).send({
              error: 'Unknown Error while uploading file '+ err
          })

        } else if (err) {
            return res.status(400).send({
                error: err.err
            })
          // An unknown error occurred when uploading.
        }
        //we save the content in database now!!

        return res.send({
            imageUrl: req.file.path,
            postedBy: req.body.username,
            publishedDate: Date.now(),
        })
        // Everything went fine.
      })
})

module.exports.storage = storage
