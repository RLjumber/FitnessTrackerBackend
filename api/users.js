/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();
const { createUser, getUserByUsername } = require("../db/users");
const jwt = require('jsonwebtoken');
const { JWT_SECRET = 'neverTell' } = process.env;

// POST /api/users/register
router.post('/register', async (req, res, next) => {

    try {
      const {username, password} = req.body;
      console.log("From POST register", username);
      const queriedUser = await getUserByUsername(username);
      if (queriedUser) {
        res.status(401);
        next({
          error: "A user by that username already exists",
          name: 'UserExistsError',
          message: `User ${username} is already taken.`
        });
      } else if (password.length < 8) {
        res.status(401);
        next({
          error: "Password too short!!",
          name: 'PasswordLengthError',
          message: 'Password Too Short!'
        });
      } else {
        const user = await createUser({
          username,
          password
        });
        if (!user) {
          next({
            error: "There was a problem registering you. Please try again",
            name: 'UserCreationError',
            message: 'There was a problem registering you. Please try again.',
          });
        } else {
          const token = jwt.sign({id: user.id, username: user.username}, JWT_SECRET, { expiresIn: '1w' });
          res.send({ user, message: "you're signed up!", token });
        }
      }
    } catch (error) {
      next(error)
    }
  })


// POST /api/users/login

// GET /api/users/me

// GET /api/users/:username/routines

module.exports = router;
