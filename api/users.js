/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();
const { createUser, getUserByUsername, getUser, getAllRoutinesByUser, getPublicRoutinesByUser } = require("../db/");
const jwt = require('jsonwebtoken');
const { JWT_SECRET = 'neverTell' } = process.env;
const {requireUser} = require("./utility");
const {getAllRoutinesByUser, getPublicRoutinesByUser} = require("../db/routines")

// POST /api/users/register
router.post('/register', async (req, res, next) => {

    try {

      const {username, password} = req.body;
      // console.log("From POST register", username);
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
router.post('/login', async (req, res, next) => {
  
  const {username, password} = req.body;

  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password"
    })
  }

  try {
    console.log("Try me", username, "password", password)
    const user = await getUser({username, password});
    // console.log("WOOT", user)

    if (user) {
      // console.log("search", user)
      const token = jwt.sign(
            {
            id: user.id, 
            username: user.username
            },

            JWT_SECRET, 

            { 
            expiresIn: '1w' 
            }
          );

          // const verifiedToken = jwt.verify(token, JWT_SECRET)

          res.send({ 
             message: "you're logged in!", 
             token, 
             user
            });
          // return verifiedToken;

    } else {
      next({
        error: "Cannot Login",
        message: 'There was a problem signing you in. Please try again.',
        name: 'UserLoginError'
      });
    }

  } catch (error) {
    next(error)
  }
})

// GET /api/users/me
router.get("/me", requireUser, (req, res, next) => {
    try {
      res.send(req.user);
    } catch (error) {
      next(error);
    }
  });

    // GET /api/users/:username/routines
    router.get("/:username/routines", async (req, res, next) => {
        const { username } = req.params;
        try {
          const user = await getUserByUsername(username);
          if (!user) {
            next({
              name: "UserNotfound",
              message: "User not found",
            });
          } else if (req.user && req.user.id === user.id) {
            const userR = await getAllRoutinesByUser(username);
            res.send(userR);
          } else {
            const publicR = await getPublicRoutinesByUser(user);
            res.send(publicR);
          }
        } catch ({ name, message }) {
          next({ name, message });
        }
      });


router.get('/:username/routines', async (req, res, next) => {
  try {
    const {username} = req.params;
    const user = await getUserByUsername(username);
if (req.user && user.id === req.user.id) {
      const routines = await getAllRoutinesByUser({username});
      res.send(routines);
    } else {
      const routines = await getPublicRoutinesByUser({username});
      res.send(routines);
    }
  } catch (error) {
    next(error)
  }
})

module.exports = router;
