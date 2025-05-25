const db = require('../models')
const Enrollment = db.enrollments


// 1. create enrollment
const addEnrollment = async (req, res) => {
    try {
      const studentID = req.user.id; // ✅ luăm din token
      const { courseID } = req.body;
  
      // Verificăm dacă e deja înrolat
      const alreadyEnrolled = await Enrollment.findOne({
        where: { studentID, courseID }
      });
  
      if (alreadyEnrolled) {
        return res.status(400).json({ message: 'Deja ești înrolat la acest curs.' });
      }
  
      const enrollment = await Enrollment.create({ studentID, courseID });
      res.status(201).json({ message: 'Înrolare reușită!', enrollment });
    } catch (err) {
      console.error('Eroare în addEnrollment:', err);
      res.status(500).json({ message: 'Eroare la înrolare.', error: err });
    }
  };
  

// 2. get single enrollment
const getOneEnrollment = async (req, res) => {

    let id = req.params.id
    let enrollment = await Enrollment.findOne({ where: { id: id }})
    res.status(200).send(enrollment)

}

// 3. delete enrollment by id
const deleteEnrollment = async (req, res) => {

    let id = req.params.id
    
    await Enrollment.destroy({ where: { id: id }} )

    res.status(200).send('Enrollment is deleted !')

}
// 4. get all enrollments
const getAllEnrollments = async (req, res) => {
    let enrollments = await Enrollment.findAll()
    res.status(200).send(enrollments)
}

const updateEnrollment = async (req, res) => {
    let id = req.params.id
    const enrollment = await Enrollment.update(req.body, { where: { id: id }})
    res.status(200).send(enrollment)
}
module.exports = {
    addEnrollment,
    getOneEnrollment,
    deleteEnrollment,
    getAllEnrollments,
    updateEnrollment
}