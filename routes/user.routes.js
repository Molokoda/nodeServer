const express = require('express');
const router = express.Router();

const controller = require('../controllers/users.controller');
const logPath = require('../middlewares/log-path.middleware');
const auth = require('../middlewares/auth.middleware');
const multerMiddleware = require('../middlewares/multer.middleware');
const validate = require('../middlewares/validation.middleware');
const createUserScheme = require('../validation-schemes/create-user.scheme');
const loginScheme = require('../validation-schemes/login.scheme');
const multer = require('multer');

router
    .get('/search', auth, controller.Userscontroller.getAll)
    .get('/:id', auth, controller.Userscontroller.get)
    .get('/me', auth, controller.Userscontroller.getMe)
    .post('/login', validate(loginScheme), controller.Userscontroller.login)
    .post('/',  multerMiddleware, validate(createUserScheme), controller.Userscontroller.add)
    .put('/:id', auth, multerMiddleware, controller.Userscontroller.update)
    .delete('/:id', auth, controller.Userscontroller.delete)
    .get('/photo/some', controller.PhotoController.getSomePhotos)
    .get('/photo/all', controller.PhotoController.readAll)
    .get('/photo/:id', controller.PhotoController.read)
    .post('/photo', multerMiddleware, controller.PhotoController.create)
    .put('/photo/:id', multerMiddleware, controller.PhotoController.update)
    .delete('/photo/:id', controller.PhotoController.delete)
module.exports = router;