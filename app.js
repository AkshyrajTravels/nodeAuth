const express = require('express')
const morgan = require('morgan');
const createError = require('http-errors')
const bodyParser = require('body-parser')
const redis = require('redis')
require('dotenv').config()
require('./helper/init_mongoDb')

const {verfyAccessToken} = require('./helper/jwt_helper')
const AuthRoutes = require('./Routes/Auth.routes');

const { extend } = require('@hapi/joi/lib/base')



const app = express();
app.use(morgan('dev'))


app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.get('/', verfyAccessToken, async(req,res,next) => {
    console.log(req.headers['authorization'])
    res.send("Hello fro, express default route")
})


app.use('/auth',AuthRoutes)

//errors handler 

app.use((req,res,next) =>{
   next(createError.NotFound("Request package not foud"))
})

app.use((err,req,res,next)=>{
    res.status(err.status || 500)
    res.send({
        error:{
            status: err.status || 500,
            message: err.message,
        },
    })
})

const PORT = process.env.PORT || 3004


app.listen(PORT,() => {
    console.log("App started on  port")
})