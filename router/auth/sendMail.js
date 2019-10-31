const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken')
const config = require('config')

module.exports.sendMail =  async function (res,email,value) {

    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        secure: true,
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

              if(error)
              {
                console.log("SENDING ERROR ",error)
                return res.status(400).send({
                  error: "Cannot sent email "
                })
              }

              else {
                console.log("SENDING VALUE ")
                return res.send({
                  emailSent:true
                })

              }
            });



        }
        else{

          return res.status(400).send({
            error: err
          })
        }
    } )
}
