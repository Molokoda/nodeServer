const express = require('express');
const router = express.Router();

const controller = require('../controllers/users.controller');
const logPath = require('../middlewares/log-path.middleware');
const auth = require('../middlewares/auth.middleware');
const multerMiddleware = require('../middlewares/multer.middleware');
const validate = require('../middlewares/validation.middleware');
const createUserScheme = require('../validation-schemes/create-user.scheme');
const loginScheme = require('../validation-schemes/login.scheme');

router
    .get('/search', auth, controller.getAll)
    .get('/:id', auth, controller.get)
    .get('/me', auth, controller.getMe)
    .post('/login', validate(loginScheme), controller.login)
    .post('/',  multerMiddleware, validate(createUserScheme), controller.add)
    .put('/:id', auth, multerMiddleware, controller.update)
    .delete('/:id', auth, controller.delete)

module.exports = router;