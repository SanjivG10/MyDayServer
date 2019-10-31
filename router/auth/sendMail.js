const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken')
const config = require('config')

module.exports.sendMail =  async function (email,value) {
    const  result = {}

    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: "bhairajagautam@gmail.com",
            pass: config.get('GMAIL_ACCOUNT_PASSWORD')
        }
    });

    jwt.sign(
        {
            exp: Math.floor(Date.now() / 1000) + (60 * 60),
            email
        },
        // change this here
        config.get('EMAIL_SERVER'),async function (err,token){
        if(!err)
        {
          try {
            await transporter.sendMail({
                from: 'MyDay', // sender address
                to: "sanjivgautamofficial@gmail.com", // list of receivers
                subject: 'Verify Your Email', // Subject line
                html: `
                    Congratulations! Your account has been successfully created. However, you need to verify that the given email is yours,
                    click the link below to verify your email address.
                    <br />
                    <b> Remember that this token expires in an hour </b>
                    <br />
                    <a href="https://floating-stream-34628.herokuapp.com/register/verifyToken?token=${token}">https://floating-stream-34628.herokuapp.com/verifyToken?token=${token}</a>
                    `
            }, (error,info)=>{
              console.log("THE ERROR => ",error)
              console.log("THE INFO => ", info)
              if(error)
              {
                result.error = error
                return new Promise((resolve,reject)=>{
                  reject(result)
                })
              }
              else {
                result.response = info
                return new Promise((resolve,reject)=>{
                  resolve(result)
                })
              }
            });

          } catch (e) {

            result.error="Email cannot be sent! ",e.message
            return new Promise((resolve,reject)=>{
              reject(result)
            })
          }

        }
        else{
            result.error = "Something went wrong. Email could not be sent"
            return new Promise((resolve,reject)=>{
              reject(result)
            })
        }
    } )
}
