const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization']

  if (!authHeader) return res.status(401).json({ message: 'Token lipsă' })

  const token = authHeader.split(' ')[1] // format: "Bearer <token>"

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded // user info va fi accesibil în controller
    next()
  } catch (err) {
    return res.status(403).json({ message: 'Token invalid sau expirat' })
  }
}

module.exports = verifyToken
