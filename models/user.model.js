const mongoose = require('mongoose')
const bcrypt = require('bcrypt')


const schema =  mongoose.Schema

const userSchema = new schema({
    email :{
        type: String,
        required : true,
        lowercase :true,
        unique : true
    },

    password:{
        type : String,
        required :true
    }

})

userSchema.pre('save',async function (next){
    //we need to use this keyword so 
    //we can use the arrow function thats why 
    //we using the function keyword..
    try {
        console.log('starting the bcrypt...')

        const salt = await bcrypt.genSalt(10)
        console.log(this.email,this.password)

        const hashed_password = await bcrypt.hash(this.password,salt)
        this.password = hashed_password
        console.log(hashed_password)
        next()

    } catch (error) {
        next(error)
        
    }
})

userSchema.methods.isValidPassword = async function (incoming_password) {
    try {
         return await bcrypt.compare(incoming_password,this.password)
    } catch (error) {
        throw error
    }
}

const user = mongoose.model('user',userSchema)

module.exports = user