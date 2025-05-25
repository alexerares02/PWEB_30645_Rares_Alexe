const courseController = require('../controllers/courseController.js');

const router = require('express').Router();
const verifyToken = require('../middleware/authMiddleware.js');

router.post('/addCourse', verifyToken, courseController.addCourse);
router.get('/professor', verifyToken, courseController.getAllCoursesByProfID);

router.get('/:id', verifyToken, courseController.getOneCourse);
router.put('/:id', verifyToken, courseController.updateCourse);
router.delete('/:id', verifyToken, courseController.deleteCourse);
router.get('/', courseController.getAllCourses);
router.get('/domain/:domain', verifyToken, courseController.getAllCoursesByDomain);
router.get('/availablelanguage/:availablelanguage', verifyToken, courseController.getAllCoursesByAvailableLanguage);
router.get('/startdate/:startdate', verifyToken, courseController.getAllCoursesByStartDate);
router.get('/enddate/:enddate', verifyToken, courseController.getAllCoursesByEndDate);
router.get('/professor/enrollment-stats', verifyToken, courseController.getEnrollmentsStatsByProfessor);
router.get('/professor/monthly-stats', verifyToken, courseController.getCoursesWithMonthlyEnrollments);



module.exports = router;