const { UnauthorizedError } = require("../utils/errors");
const { BadRequestError } = require("../utils/errors");
const bcrypt = require("bcrypt");
const db = require("../db");
const { BCRYPT_WORK_FACTOR } = require("../config");

class User {
  static async login(credentials) {}
  static async register(credentials) {
    const requiredFields = [
      "email",
      "password",
      "first_name",
      "last_name",
      "location",
    ];

    requiredFields.forEach((field) => {
      if (!credentials.hasOwnProperty(field)) {
        throw new BadRequestError(`Missing ${field} in request body`);
      }
    });

    if (credentials.email.indexOf("@") <= 0) {
      throw new BadRequestError("Invalid email");
    }

    const existingUser = await User.fetchUserByEmail(credentials.email);
    if (existingUser) {
      throw new BadRequestError(`Duplicate email: ${credentials.email}`);
    }
    const hashedPassword = await bcrypt.hash(
      credentials.password,
      BCRYPT_WORK_FACTOR
    );

    const lowerCaseEmail = credentials.email.toLowerCase();

    const result = await db.query(
      `
      INSERT INTO users(email, password, first_name, last_name, location) 
      VALUES($1,$2,$3,$4,$5)
      RETURNING id,email,password,first_name,last_name,location,date;
      `,
      [
        lowerCaseEmail,
        hashedPassword,
        credentials.first_name,
        credentials.last_name,
        credentials.location,
      ]
    );

    const user = result.rows[0];
    return user;
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
