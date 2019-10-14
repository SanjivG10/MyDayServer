const Joi = require('joi')

module.exports.verifyUser = function (user){
    const schema = Joi.object({
        username: Joi.string()
            .alphanum()
            .min(4)
            .max(30)
            .required(), 
        password: Joi.string()
            .min(6)
            .required()
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/),
        email: Joi.string().required()
            .email({ minDomainSegments: 2 })
    })

   return schema.validate({
        username: user.username, 
        password: user.password, 
        email: user.email 
        })
}