/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();
const { createUser, getUserByUsername } = require("../db/users");
const jwt = require('jsonwebtoken');

// POST /api/users/register
router.post('/register', async (req, res, next) => {
    console.log("req.body: ", req.body)
    const { username, password } = req.body;

    try {
        const _user = await getUserByUsername(username);

        if (_user) {
            next({
                name: "UserExistError",
                message: `User ${username} is already taken.`,
                error: "Error!",
            }) 
        if (password.length < 8) {
            next({
                name: "PasswordLengthError",
                message: `Password too short!!.`,
                error: "Error!",
            })
            const user = await createUser({ username, password })

            const token = jwt.sign({
                id: user.id,
                username
            }, process.env.JWT_SECRET)

            res.send({
                user: {
                    id: user.id,
                    username: username
                },
                message: "You're signed up !",
                token: token
            })
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
