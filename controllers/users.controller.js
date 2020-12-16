const usersService = require('../services/users.service.js');

class Userscontroller {

    service = usersService;

    getAll = async(req, res, next) => {
        res
            .status(200)
            .send( await(this.service.getAllUsers()) );      
    }

    get = async(req, res, next) => {
        res
            .status(200)
            .send( await(this.service.getUser(req.params.id)) );      
    }

    getMe = async(req, res, next) => {
        res
            .status(200)
            .send( await(this.service.getUser(req.user.id)) );      
    }

    add = (req, res, next) => {
        res
            .status(201)
            .send(this.service.addUser({
                ...JSON.parse(req.body.data),
                avatar: req.file.path
            }) )
    }

    update = async(req, res, next) => {
        res
            .status(201)
            .send(
                await( this.service.update( {
                    ...JSON.parse(req.body.data),
                    avatar: req.file.path
                }, req.params.id) )
            )
    }

    delete = (req, res, next) => {
        res
            .status(201)
            .send(this.service.deleteUser(req.params.id))
    }

    login = async(req, res, next) => {
        res
            .status(200)
            .send( await( this.service.login( req.body ) ) );      
    }
}

module.exports = new Userscontroller();