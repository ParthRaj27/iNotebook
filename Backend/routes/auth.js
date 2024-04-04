const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = "ParthIsMostHandSomePerson";

// ROUTE 1 : Create a User using: POST "/api/auth/createuser" . No login Required
router.post(
  "/createuser",
  [
    body("name", "Enter a  Vallid Name").isLength({ min: 3 }),
    body("email", "Enter a  Vallid Email").isEmail(),
    body("password", "Enter a  Vallid Password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    let success = false;
    // console.log(req.body)
    // if there are errors, return Bad Request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      success = false;
      return res.status(400).json({ success, errors: errors.array() });
    }
    // const user = User(req.body);
    // user.save()
    // res.send(req.body);
    // check wheater the user with same email exists already
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "sorry the user with this email is already exists" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      // create a new user
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authtoken });
      // res.json(user);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("interenal server error");
    }
    // .then(user => res.json(user))
    // .catch(err=>{console.log(err)
    // res.json({error : 'Please Enter A unique Value For A Email' ,message: err.message})})
  }
);

// ROUTE 2 : Authenticate a User using: POST "/api/auth/login" . No login Required
router.post(
  "/login",
  [
    // body('name' , 'Enter a  Vallid Name').isLength({ min: 3 }),
    body("email", "Enter a  Vallid Email").isEmail(),
    body("password", "Password Cant Be Blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        success: false;
        return res
          .status(400)
          .json({
            success,
            error:
              "invalid credentials please try again with corrent credentials",
          });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success: false;
        return res.status(400).json({
          success,
          error:
            "invalid credentials please try again with corrent credentials",
        });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("interenal server error");
    }
  }
);

// ROUTE 3 : Get Logged in user details using: POST "/api/auth/getuser" . login Required
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findOne(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("interenal server error");
  }
});
module.exports = router;
