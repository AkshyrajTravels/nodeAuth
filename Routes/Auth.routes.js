const express = require('express')
const createErrors = require('http-errors')

const User = require('../models/user.model')
const routes = express.Router()
const {authSchema} = require('../helper/validation_schema')
const { siginAccessToken} = require('../helper/jwt_helper')
const user = require('../models/user.model')


routes.post('/register',async(req,res,next)=>{
    try {
        //const {email,password} = req.body
            //if(!email || !password)throw createErrors.BadRequest()

            console.log('working fine....')

            const result = await authSchema.validateAsync(req.body)
            console.log(result)

            const doesExist = await User.findOne({email:result.email})
            if(doesExist)throw createErrors.Conflict(`${result.email} is allready been registerd..` )
 
            const user = new User(result)

            const savedUser = await user.save()


            const accessToken = await siginAccessToken(savedUser.id)


            res.send({accessToken})

    } catch (error) {
        if(error.isJoi ==true) error.status = 422
        next(error)
    }
   
   
})

routes.post('/login',async(req,res,next)=>{
    try {
        //we can use same schema here also 
         const result = await authSchema.validateAsync(req.body)


         const user  = await User.findOne({email :result.email})
         if(!user) throw createErrors.NotFound("User not registerd")

         const isMatch = await user.isValidPassword(result.password)

         if(!isMatch) throw createErrors.Unauthorized("Username/password not correct ")

         const access_token = await siginAccessToken(user.id)

         console.log(access_token)
         

         res.send({ access_token})
        
    } catch (error) {
        if(error.isJoi == true) return next(createErrors.BadRequest("Invalid Username or password"))
        next(error)
    }

})

routes.post('/refresh-token',async(req,res,next)=>{
    res.send("refresh-token routes..")
})

routes.delete('/logout',async(req,res,next)=>{
    res.send("logout routes..")
})



module.exports = routes