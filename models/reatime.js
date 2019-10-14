const  mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/realtime');


db.on('error', ()=> 
    console.log("Connection Error"))

db.once('open', function() {
  console.log("SUCCESSFULLY CONNECTED"); 
});


const users = new mongoose.Schema({
    name: String, 
    username: String, 
    dateOfCreation: {
        type: Date, 
        default : Date.now()
    },
    profile: String, 
    followers: {
        type: Array
    }, 
    following: {
        type: Array
    }
}); 

const posts = new mongoose.Schema({
    userID: {
        type: mongoose.Types.ObjectId
    }, 
    publishedDate: {
        type: Date
    }, 
    caption: {
        type: String
    },
    // array because user can posts more than 1 image at once
    images : {
        type: Array
    }

}); 

const notifications = new  mongoose.Schema({
     
}); 

