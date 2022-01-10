const e = require('express')
const mongoose = require('mongoose')


mongoose.connect('mongodb://localhost:27017',
{
    dbName:"user"

})
.then(()=>{
    console.log("Mongo db is connected..")
}).catch((err)=>console.log(err.message))


mongoose.connection.on('connected',()=>{
    console.log("Mongo connection established")
})

mongoose.connection.on('error',(err)=>{
    console.log("error")
    console.error(err)
})

mongoose.connection.on('disconnected',()=>{
    console.log("MongoDb is disConnected")
})

process.on('SIGINT',async()=>{
    await mongoose.connection.close();

    process.exit(0)
})