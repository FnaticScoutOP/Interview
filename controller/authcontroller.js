const User=require('../model/user');
const jwt=require('jsonwebtoken');
const handlerrors=(err)=>{
    var error={username:"",password:""};
if(err.code===11000)
    {
        error.username+="This username already exist";
        return error;
    }
if(err.message==="Incorrect Password")
    {
        error.password="Wrong Password";
        return error;
    }
if(err.message==="Incorrect Username")
    {
        error.username="Wrong Username";
        return error;
    }
    //we must put errors only and properties only
if(err.message.includes('recipe validation failed'))
    {
        Object.values(err.errors).forEach(({properties})=>{
            error[properties.path]=properties.message;
        });
    }
    return error;
}

const max=3*24*60*60;
const createtoken =(id)=>{
    return jwt.sign({id},'secret',{
        expiresIn: max
    });
}

module.exports.signup_get= (req,res)=>{
    res.render('signup');
}

module.exports.signup_post=async (req,res)=>{
    const {username,password}=req.body;
      try{
      const user = await User.create({username,password});
      const token=createtoken(user._id);
      res.cookie('jwt',token,{httpOnly:true,maxAge:max*1000});
      res.status('200').json({user});
      }
      catch(err){
          const errors=handlerrors(err);
          console.log(errors);
          res.status('404').json({errors});
      }
    }

module.exports.login_get= (req,res)=>{
    res.render('login');
}

module.exports.login_post= async (req,res)=>{
    const {username,password}=req.body;
    try{
    const user=await User.login(username,password);
    const token=createtoken(user._id);
    res.cookie('jwt',token,{httpOnly:true,maxAge:max*1000});
    res.status('200').json({user});
    }
    catch(err)
    {
        const errors=handlerrors(err);
        console.log(errors);
        res.status('404').json({errors});
    }
}

module.exports.logout_get=async (req,res)=>{
    res.cookie('jwt','',{maxAge:1});
    res.redirect('/');
}