const {Client} = require("pg")
const { getDataBaseURi } = require("./config")
require("colors")

const db = new Client({ connectionString: getDataBaseURi() })

db.connect((err) => {
    if (err)
    {
        console.log("connection error".red, err.stack)
        
    }
    else {
        console.log("Successfully connected to postgress db".blue)
    }
})

module.exports = db
