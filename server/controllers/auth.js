const User = require('../models/user')
exports.createOrUpdateuser = async(req,res) => {
    const {name,picture,email} = req.user;
    
    const user = await User.findOneAndUpdate(
        {email},
        {name: email.split("@")[0],picture},
        {new:true})

    if(user){
        console.log("user updated",user)
        res.json(user)
    }else{
        const newUser = await new User({
            email,
            name:email.split("@")[0],
            picture,
        }).save();
        console.log("user created",newUser)
        res.json(newUser)
    }
};

exports.Currentuser = async(req,res) => {
    User.findOne({email: req.user.email}).exec((error,user) => {
        if(error) throw new Error(error);
        res.json(user);
    })
}