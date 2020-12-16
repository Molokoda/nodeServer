const validate = (schema) => async (req, res, next) => {

    try{
        let user;
        if( req.body.data){
            user = JSON.parse(req.body.data);
        }else{
            user = req.body;
        }

        const value = await schema.validateAsync(user);
        next()
    }
    catch(err){
        res.status(400).send(err);
        
    }
}

module.exports = validate;