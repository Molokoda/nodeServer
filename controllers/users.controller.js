const services = require('../services/users.service.js');

class Userscontroller {
    
    service = services.DBusersService;

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

class PhotoController{
    service = services.DBphotoServices;

    readAll = async(req, res, next) => {
        res
            .status(200)
            .send( await(this.service.readAllPhoto()) );      
    }

    read = async(req, res, next) => {
        res
            .status(200)
            .send( await(this.service.readPhoto(req.params.id)) );      
    }

    create = async(req, res, next) => {
        res
            .status(201)
            .send(await this.service.createPhoto({
                ...JSON.parse(req.body.data),
                file_path: req.file.path
            }) )
    }

    update = async(req, res, next) => {
        res
            .status(201)
            .send(
                await( this.service.updatePhoto( {
                    ...JSON.parse(req.body.data),
                    filte_path: req.file.path
                }, req.params.id) )
            )
    }

    delete = async(req, res, next) => {
        res
            .status(201)
            .send(await this.service.deletePhoto(req.params.id))
    }

    getSomePhotos = async(req, res, next) => {
        res 
            .status(201)
            .send(await this.service.getSomePhotos(req.query.page, req.query.count))
    }

}

module.exports.Userscontroller = new Userscontroller();
module.exports.PhotoController = new PhotoController();