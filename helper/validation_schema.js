const joi = require('@hapi/joi')

//creting authScema
const authSchema = joi.object({
    email:joi.string().email().lowercase().required(),
    password:joi.string().min(5).required(),
})


module.exports = {
    //exporting object
    authSchema,
}