const jwt = require('jsonwebtoken')
const config = require('config')

module.exports.checkPostAuth = async (req, res, next)=>{
    console.log("THE REQ OBJECT IS ",req)
    console.log("THE REQ BODY IS ", req.body)
    console.log("THE REQ FILE IS ", req.file)
    if (req.body.token)
        try {
            const decoded = await jwt.verify(req.body.token, config.get('POST_SECRET'));
            return next();

          } catch(error) {

            res.status(401).send({
                error:'You are not allowed to view this page.'
            })
          }
    else {
        return res.status(401).send({
            error:'You are not authorized to post.'
        })
    }

    // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
    res.redirect('/');

}


module.exports.checkVerifyAuth = (req, res, next)=>{
    if (req.body.token)

        return next();
    else {
        return res.status(401).send({
            err:'You are not allowed to view this page.'
        })
    }

    // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
    res.redirect('/');

}

module.exports.checkAuth = (req,res,next)=>{
    if (req.body.user)
        return next();
    else {
        return res.status(401).send({
            err:'Not authenticated. You are not allowed to view this page'
        })
    }
}
