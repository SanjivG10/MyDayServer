const  mongoose = require('mongoose')

mongoose.connect('mongodb+srv://sanjiv:sanjiv@cluster0-nruyn.mongodb.net/storage');

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

const storySchema = new mongoose.Schema({
    story: {
      type:String
    },
    username: {
      type: String
    },
    date: {
      type:Date,
      default: Date.now()
    }, 
    caption: {
      type:String
    }
})

const profilemodel = mongoose.model('profile',profileSchema);
const storyModel = mongoose.model('stories',storySchema);



exports.profilemodel = profilemodel;
exports.storyModel = storyModel;
