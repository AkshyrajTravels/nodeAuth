const jwt  = require('jsonwebtoken')
const createErrors = require('http-errors')
const { create } = require('../models/user.model')
const { JsonWebTokenError } = require('jsonwebtoken')
const { reject } = require('bcrypt/promises')

module.exports = {
    siginAccessToken : (userId) => {
        return new Promise((resolve,reject)=>{
            const payload = {}
            const secret = process.env.ACCESS_TOKEN_SCRET
            const option = {
                expiresIn : '30s',
                issuer : "google.com",
                audience : userId,
            }
            jwt.sign(payload, secret, option,  (error, token) => {
                if(error) {
                    console.log(error.message)
                
                
                reject(createErrors.InternalServerError())
                }
                resolve(token)
            })
        })
    },
    verfyAccessToken:(req,res,next) =>{
        if(!req.headers['authorization']) return next(createErrors.Unauthorized("you don't have the refresh token..."))

    
        const authHeaders = req.headers['authorization']


        const bearertoken = authHeaders.split(' ')
        //atcual token 
        const token = bearertoken[1]


        jwt.verify(token,process.env.ACCESS_TOKEN_SCRET , (err,payload) =>{
            if(err) {
                if(err.name === 'JsonWebTokenError'){
                    return next(createErrors.Unauthorized())
                }else{
                     return next(createErrors.Unauthorized(err.message))
                }
              
            }

            //if there is no errors

            req.payload = payload
            next()
        })
    },

    signRefreshToken :(userId) => {
        return new Promise((resolve,reject)=>{
            const payload = {}
            const secret = process.env.REFRESH_TOKEN_SECRET
            const option = {
                expiresIn : '1y',
                issuer : "google.com",
                audience : userId,
            }
            jwt.sign(payload, secret, option,  (error, token) => {
                if(error) {
                    console.log(error.message)
                
                
                reject(createErrors.InternalServerError())
                }
                resolve(token)
            })
        })
    },

    verfyRefreshToken : (refreshToken) =>{
       return new Promise((resolve ,reject) => {
           jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET,(err,payload)=>{
               if(err) return reject(createErrors.Unauthorized())
               const userID = payload.aud 
               resolve(userID)
           })
       })
    }
}