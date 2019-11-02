const  mongoose = require('mongoose')

// mongoose.connect('mongodb+srv://sanjiv:sanjiv@cluster0-nruyn.mongodb.net/storage',{ useNewUrlParser: true, useUnifiedTopology: true  })
//
// const db = mongoose.connection;
//
// db.on('error', ()=>
//     console.log("Connection Error"))
//
// db.once('open', function() {
//   console.log("SUCCESSFULLY CONNECTED TO STORAGE DATABASE");
// });



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

const storyModel = mongoose.model('stories',storySchema);

exports.storySchema = storySchema;
