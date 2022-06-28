const express = require("express")

const cors = require("cors")

const morgan = require("morgan")
const { BadRequestError, NotFound } = require("./utils/errors")

const { PORT } = require('./config')

const authRoutes = require("./routes/auth")

const app = express()

app.use(cors())
app.use("/auth",authRoutes)
// pass incoming request
app.use(express.json())
app.use(morgan("tiny"))

app.use((req, res, next) => {
    return next(new NotFound())
})

//Generic error
app.use((err, req, res, next) => {
    //setp error status 
    const status = err.status || 500
    const message = err.message

    return res.status(status).json({
        error: {message,status}
    })
})


 
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})