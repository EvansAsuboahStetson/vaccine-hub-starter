require("dotenv").config()

require("colors")

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001

function getDataBaseURi()
{
    const dbUser = process.env.DATABASE_USER || "postgres"
    const dbPass = process.env.DATABASE_PASS ? encodeURI(process.env.DATABASE_PASS):  "qwerty"
    const dbHost = process.env.DATABASE_HOST || "localhost"
    const dbPort = process.env.DATABASE_PORT || 5432
    const dbName = process.env.DATABASE_NAME || "vaccine_hub"
    // if the DATABASE_URL environment , use that

    return process.env.DATABASE_URL || `postgresql://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}`
    
}
console.log("User Registration Config".green)
console.log("PORT".blue, PORT)
console.log("Database URI".blue, getDataBaseURi())

module.exports = {
    PORT,
    getDataBaseURi
}