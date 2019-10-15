const  mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/users',{ useNewUrlParser: true, useUnifiedTopology: true  });

const db = mongoose.connection;

db.on('error', ()=>{
    console.log('Some  Error Occured on Database!')
});

db.once('open', function() {
    console.log('Users Database is off and running! ')
});


const fbUserSchema = new mongoose.Schema({
    fbID: {
        type: String, 
        required:true
    }, 

    accessToken : {
        type:String,
        required:true , 
    }, 

    username : {
        type: String,
        min:4, 
        max: 50
    }, 

    image : {
        type: String
    }, 

    follows : {
        min: 0, 
        type: Array
    }, 

    following : {
        min: 0, 
        type: Array
    }, 

    lastOnline : {
        type: Date
    }, 

    posts: {
        type: Array, 
        min: 0
    }, 
    
    notifications : {
        type: Array, 
        min: 0
    }, 

    speciality : {
        enum : ['naive','semi-pro','professional','world-class','legend']
    }

})


const googleUserSchema = new  mongoose.Schema({
    googleID: {
        type: String, 
        required:true
    }, 

    id_token : {
        type:String,
        required:true , 
    }, 

    username : {
        type: String,
        min:4, 
        max: 50
    }, 

    image : {
        type: String
    }, 

    follows : {
        min: 0, 
        type: Array
    }, 

    following : {
        min: 0, 
        type: Array
    }, 

    lastOnline : {
        type: Date
    }, 

    posts: {
        type: Array, 
        min: 0
    }, 
    
    notifications : {
        type: Array, 
        min: 0
    }, 

    speciality : {
        enum : ['naive','semi-pro','professional','world-class','legend']
    }
}) 



const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min:4, 
        max: 30, 
        unique: true
    }, 
    // we are saving becrypted password so length won't match up, so we give arbitary value which doesnt generate error! 
    password: {
        required: true,
        type: String, 
        validate: {
            validator: function(v) {
              return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/.test(v);
            },
            message: password => `${password.value} password is not valid! `
          },
    }, 
    email : {
        required : true, 
        unique: true, 
        type: String,
        // I didn't validate email here because of regex of SO which I don't trust at all and will rely on Joi for that! 
    }, 

    emailVerified : {
        type: Boolean, 
        required: true
    }, 

    image:{
        type: String
    }, 

    follows : {
        min: 0, 
        type: Array
    }, 

    following : {
        min: 0, 
        type: Array
    }, 

    lastOnline : {
        type: Date
    }, 

    posts: {
        type: Array, 
        min: 0
    }, 
    
    notifications : {
        type: Array, 
        min: 0
    }, 

    speciality : {
        enum : ['naive','semi-pro','professional','world-class','legend']
    }

  });


  module.exports.user = mongoose.model('users',userSchema)
  module.exports.fbUser = mongoose.model('fbUsers',fbUserSchema)
  module.exports.googleUser = mongoose.model('goolgeUsers',googleUserSchema)