const express = require("express");
const User = require("../models/user");
const router = express.Router();

router.post("/login", async (req, res, next) => {
  try {
    //take users email password and authenticate
    const user = await User.login(req.body);
    return res.status(200).json({user});
  } catch (err) {
    next(err);
  }
});

router.post("/register", async (req, res, next) => {
    try {
        console.log(await req.body)
        const user = await User.register(req.body)
        console.log(req.body)
        return res.status(201).json({user})
  } catch (err) {w
    next(err);
  }
});
module.exports = router;
