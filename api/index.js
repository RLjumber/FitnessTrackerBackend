const express = require("express");
const router = express.Router();
const cors = require("cors");
router.use(cors());

// GET /api/health
router.get('/health', async (req, res, next) => {

    res.status(200).send({
        message: "Okkkk lets go"
    })

    next();
});

// ROUTER: /api/users
const usersRouter = require('./users');
router.use('/users', usersRouter);

// ROUTER: /api/activities
const activitiesRouter = require('./activities');
router.use('/activities', activitiesRouter);

// ROUTER: /api/routines
const routinesRouter = require('./routines');
router.use('/routines', routinesRouter);

// ROUTER: /api/routine_activities
const routineActivitiesRouter = require('./routineActivities');
router.use('/routine_activities', routineActivitiesRouter);

module.exports = router;
