const enrollmentController = require('../controllers/enrollmentController');
const router = require('express').Router();
const verifyToken = require('../middleware/authMiddleware.js');

router.post('/addEnrollment', verifyToken, enrollmentController.addEnrollment);
router.get('/:id', verifyToken, enrollmentController.getOneEnrollment);
router.delete('/:id', enrollmentController.deleteEnrollment);
router.get('/', verifyToken, enrollmentController.getAllEnrollments);
router.put('/:id', enrollmentController.updateEnrollment);

module.exports = router;