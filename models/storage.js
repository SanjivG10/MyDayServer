const  mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/storage');

const db = mongoose.connection;

db.on('error', ()=> 
    console.log("Connection Error"))

db.once('open', function() {
  console.log("SUCCESSFULLY CONNECTED"); 
});


// so we have profile array that contains profile pictures of different users. We will save them as username.jpg, so no extra storage would be required 
// next we have images array which contains usersArray which will have userID array which stores the image they post
// the names of the image would be the timestamp. 

const profileSchema = new mongoose.Schema({
    profile: {
        type: Array
    }
}) 

const imageSchema = new mongoose.Schema({
    images: [
        {
            userID: [String]
        }
    ]
})

const profilemodel = mongoose.model('profile',profileSchema); 
const imagesModel = mongoose.model('images',imageSchema); 



exports.profilemodel = profilemodel; 
exports.imagesModel = imagesModel;