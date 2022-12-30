const Users = require('../models/userModels')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const authCtrl = {
    register : async(req,res)=>{
        try {
            const {UserName, email, password} = req.body
            let newUserName = UserName.toLowerCase().replace(/ /g,'')

            const user_name = await Users.findOne({username : newUserName})
            if(user_name) return res.status(400).json({msg : "this user name already exists."})

            const user_email = await Users.findOne({email})
            if(user_email) return res.status(400).json({msg : "this email already exists."})

            if(password.length < 8){
                return res.status(400).json({msg : "password must be greater than 7 characters"})
            } 

            const passwordHash = await bcrypt.hash(password,12)
            
            const newUser = new Users({
                UserName : newUserName,
                email,
                password : passwordHash
            })
            newUser.save();
            console.log(newUser)

            const access_token = createAccessToken({id: newUser._id})
            const refresh_token = createRefreshToken({id: newUser._id})

            res.cookie('refresh_token',refresh_token,{
                httpOnly: true,
                path: '/refresh_token',
                maxAge: 30*24*60*60*1000
            })

            // console.log({access_token, refresh_token})

            res.json({
                msg : 'Register successfully! ',
                access_token,
                user:{
                    ...newUser._doc,
                    password: ''
                }
            })

        } catch (err) {
            return res.status(500).json({msg : err.message})
        }
    },
    login : async(req,res)=>{
        try {
           const {email, password} = req.body

           const user = await Users.findOne({email})

           if(!user) return res.status(400).json({msg : "This email does not exist"})

           const isMatch = await bcrypt.compare(password,user.password)
           if(!isMatch) return res.status(400).json({msg: "password is incorrect."})

           const access_token = createAccessToken({id: user._id})
           const refresh_token = createRefreshToken({id: user._id})

           res.cookie('refresh_token',refresh_token,{
                httpOnly: true,
                path: '/refresh_token',
                maxAge: 30*24*60*60*1000
            })

            res.json({
                msg : 'Login successfully! ',
                access_token,
                user:{
                    ...user._doc,
                    password: ''
                }
            })
        } catch (err) {
            return res.status(500).json({msg : err.message})
        }
    },
    logout : async(req,res)=>{
        try {
            res.clearCookie('refresh_token',{path: '/refresh_token'})
            return res.json({msg: "Logged out Successfully"})
            
        } catch (err) {
            return res.status(500).json({msg : err.message})
        }
    },
    // generateAccessToken : async(req,res)=>{
    //     try {
            
    //         // const rf_token = req.cookies.refresh_token
    //         // req.cookie
    //         console.log(req.cookies.UserName);
    //         // res.json({rf_token})
    //     } catch (err) {
    //         return res.status(500).json({msg : err.message})
    //     }
    // }
}

const createAccessToken = (payload) =>{
    return jwt.sign(payload,`${process.env.ACCESS_TOKEN_SECRET}`, {expiresIn: '1d'})
}

const createRefreshToken = (payload) =>{
    return jwt.sign(payload, `${process.env.REFRESH_TOKEN_SECRET}`, {expiresIn: '30d'})
}
module.exports = authCtrl
