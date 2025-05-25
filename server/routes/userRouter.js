const { verify } = require('jsonwebtoken')
const userController = require('../controllers/userController.js')
const verifyToken = require('../middleware/authMiddleware.js')

const router = require('express').Router()

router.post('/register', userController.registerUser)
router.post('/login', userController.loginUser)

router.get('/:id', verifyToken, userController.getOneUser)

router.put('/:id', verifyToken, userController.updateUser)

router.delete('/:id', verifyToken, userController.deleteUser)

module.exports = router