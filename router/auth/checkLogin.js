module.exports.checkVerifyAuth = (req, res, next)=>{
    if (req.body.token)
        return next();
    else {
        return res.header(401).send({
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
        return res.header(401).send({
            err:'Not authenticated. You are not allowed to view this page'
        })
    }
}