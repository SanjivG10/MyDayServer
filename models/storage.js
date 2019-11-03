const  mongoose = require('mongoose')

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
exports.storyModel  = storyModel
