const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken')
const config = require('config')

module.exports.sendMail =  async function (res,email,value) {


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
            });
            console.log("EMAIL SENT COMPLETED ")
            return res.send({
                emailSent: true,
                emailSentMsg: 'Email has been sent. Make sure you verify the email within an hour!'
            })
          } catch (e) {
              console.log("SOME ERROR ON TRY METHOD")
              return res.status(400).send('Error Occured while Verifying Email ', e.message)
          }

        }
        else{
            return res.status(400).send('Error Occured while Verifying Email ', err)
        }
    } )
}
