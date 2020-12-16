const Joi = require('joi');

const schema = Joi.object({

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

    id: Joi.number()
    .integer(),
})
    
    module.exports = schema;