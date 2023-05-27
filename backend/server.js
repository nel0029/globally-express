const express = require('express')
const dotenv = require('dotenv').config()
const { errorHandler } = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
const cors = require('cors')
const port = process.env.PORT || 5000;

connectDB()

const app = express()
app.use(cors({
    origin: 'http://127.0.0.1:5173',
}));
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/', require('./routes/postsRoutes'))
app.use('/user', require('./routes/userRoutes'))

app.use(errorHandler)

app.listen(port, () => console.log(`Running on port ${port}`))