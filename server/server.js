const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()

//middleware

app.use(cors())

app.use(express.json())

app.use(express.urlencoded({extended: true}))

// routers

const userRouter = require('./routes/userRouter.js')
const courseRouter = require('./routes/courseRouter.js')
const enrollmentRouter = require('./routes/enrollmentRouter.js')
const offerRouter = require('./routes/offerRouter.js')
app.use('/api/offers', offerRouter)
app.use('/api/enrollments', enrollmentRouter)
app.use('/api/courses', courseRouter)
app.use('/api/users', userRouter)


//port

const PORT = process.env.PORT 

//server
app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`)
})