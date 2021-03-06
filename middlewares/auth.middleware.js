const jwt = require('jsonwebtoken');
const userService = require('../services/users.service.js');

const auth = (req, res, next) => {
    try{
        const [strategy, token] = req.headers['authorization'].split(' ');
        const result = jwt.verify(token, 'secret');
        userService.DBusersService.getUser(result.id).then(user => { 
            req.user = user;
            next();
        })
    }catch(err) {
        res.status(401).send(err.message);
    }
}

module.exports = auth;