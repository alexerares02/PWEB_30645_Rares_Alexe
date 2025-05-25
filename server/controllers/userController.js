const db = require('../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//create main Model
const User = db.users
const Course = db.courses
const Enrollment = db.enrollments

// main work


//1. create user(register)
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role, language } = req.body;

        // Validate role
        if (!['student', 'professor'].includes(role)) {
            return res.status(400).send("Role must be 'student' or 'professor'");
        }

        // Check if user exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).send('Email is already registered');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            language
        });

        res.status(201).send({
            message: 'User registered successfully',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                language: newUser.language
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server error during registration');
    }
};

// login


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Căutăm userul
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verificăm parola
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Parolă greșită' });
    }

    // 🔄 Obținem enrollments separat (fără relație)
    const enrollments = await Enrollment.findAll({
      where: { studentID: user.id }
    });

    // 🔐 Creăm token
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '2h'
    });

    // ✅ Trimitem userul cu enrollments
    res.status(200).json({
      message: 'Login reușit',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        language: user.language,
        enrollments: enrollments.map(e => ({
          courseId: e.courseID
        }))
      }
    });

  } catch (err) {
    console.error('Eroare la login:', err);
    res.status(500).json({ message: 'Eroare internă la login' });
  }
};


// 2. get single user

const getOneUser = async (req, res) => {

    let id = req.params.id
    let user = await User.findOne({ where: { id: id }})
    res.status(200).send(user)

}

// 3. update user

const updateUser = async (req, res) => {

    let id = req.params.id

    const user = await User.update(req.body, { where: { id: id }})

    res.status(200).send(user)

}


// 4. delete user by id

const deleteUser = async (req, res) => {

    let id = req.params.id
    
    await User.destroy({ where: { id: id }} )

    res.status(200).send('User is deleted !')

}


module.exports = {
    registerUser,
    loginUser,
    getOneUser,
    updateUser,
    deleteUser
}