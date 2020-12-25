const jwt=require('jsonwebtoken');
const User=require('../model/user');
const reqauth=(req,res,next)=>{
    const token=req.cookies.jwt;
    if(token)
    {
        jwt.verify(token,"secret",(err,decoded)=>{
            if(err)
            {
                console.log(err);
                res.redirect('/login');
            }
            else
            {
                console.log(decoded);
                next();
            }
        });
    }
    else
    res.redirect('/login');
}

//checking user
const checkuser=(req,res,next)=>{
const token=req.cookies.jwt;
if(token){
    jwt.verify(token,"secret",async (err,decoded)=>{
        if(err)
        {
            console.log(err);
            res.locals.user=null;
            next();
        }
        else
        {
            console.log(decoded);
            let user=await User.findById(decoded.id);
            res.locals.user=user;
            console.log("doing my work",user);
            next();
        }
    });
}
else{
    res.locals.user=null;
    console.log("doing");
    next();
}
}

module.exports={reqauth,checkuser};