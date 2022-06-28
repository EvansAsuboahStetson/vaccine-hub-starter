const express = require("express")

const cors = require("cors")

const morgan = require("morgan")
const {BadRequestError, NotFound}= require("./utils/errors")
const app = express()

app.use(cors())
// pass incoming request
app.use(express.json())
app.use(morgan("tiny"))

app.use((req, res, next) => {
    return next(new NotFound())
})

const PORT = process.env.PORT || 3001
 
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})