const { UnauthorizedError } = require("../utils/errors");
const { BadRequestError } = require("../utils/errors");
const bcrypt = require("bcrypt");
const db = require("../db");
const { BCRYPT_WORK_FACTOR } = require("../config");

class User {
  static async makePublicUser(user) {
    return {
      id: user.id,
      email: user.email,
      location: user.location,
      first_name: user.first_name,
      last_name: user.last_name,
      date: user.date
    };
  }
  static async login(credentials) {
    const requiredFields = ["email", "password"];

    requiredFields.forEach((field) => {
      if (!credentials.hasOwnProperty(field)) {
        console.log("Login-","error")
        throw new BadRequestError(`Missing ${field} in request body`);
      }
    });
    const user = await User.fetchUserByEmail(credentials.email);
    if (user) {
      const isValid = await bcrypt.compare(credentials.password, user.password);

      if (isValid) {
        return User.makePublicUser(user);
      }
    }
    throw new UnauthorizedError("Invalid email/password-combo");
  }
  static async register(credentials) {
    const requiredFields = [ "email","password","firstName","lastName","location"];

    requiredFields.forEach((field) => {
      
      if (!credentials.hasOwnProperty(field)) {
        console.log("Register-","error")
        throw new BadRequestError(`Missing ${field} in request body`);
      }
    });

    if (credentials.email.indexOf("@") <= 0) {
      console.log("Invalid-","error")
      throw new BadRequestError("Invalid email");
    }
    const existingUser = await User.fetchUserByEmail(credentials.email);
    console.log(existingUser)
    if (existingUser) {
      console.log("existing user")
      throw new BadRequestError(`Duplicate email: ${credentials.email}`);
    }
    const hashedPassword = await bcrypt.hash(
      credentials.password,
      BCRYPT_WORK_FACTOR
    );

    const lowerCaseEmail = credentials.email.toLowerCase();

    const result = await db.query(
      `
      INSERT INTO users(email, password, first_name, last_name, location,date) 
      VALUES($1,$2,$3,$4,$5,$6)
      RETURNING id,email,password,first_name,last_name,location,date;
      `,
      [
        lowerCaseEmail,
        hashedPassword,
        credentials.firstName,
        credentials.lastName,
        credentials.location,
        credentials.date
      ]
    );

    const user = result.rows[0];
    return User.makePublicUser(user);
  }
  static async fetchUserByEmail(email) {
    if (!email) {
      throw new BadRequestError("No email provided");
    }
    const query = `SELECT * FROM users WHERE email = $1`;
    const result = await db.query(query, [email.toLowerCase()]);
    const user = result.rows[0];
    return user;
  }
}
module.exports = User;
