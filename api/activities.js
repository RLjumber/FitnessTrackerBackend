const express = require('express');
const router = express.Router();
const { requireUser } = require("./utility");
const {
    getAllActivities,
    getActivityById,
    getActivityByName,
    attachActivitiesToRoutines,
    createActivity,
    updateActivity,
    getPublicRoutinesByActivity
  } = require('../db')

// GET /api/activities/:activityId/routines

// GET /api/activities

// POST /api/activities

// PATCH /api/activities/:activityId

router.get("/", async (req , res, next) => {
    try{
        const allActivities = await getAllActivities();
        res.send(allActivities)
    } catch (error){
        next(error);
    }
})

router.post("/", requireUser, async (req , res, next) => {
    try{
        const { name, description } = req.body;
        const _activity = await getActivityByName(name)
        if (_activity) {
            next({
                name: "ActivityExistsError",
                message: `An activity with name ${name} already exists`,
                error: "ActivityExistsError"
            });
        } else {
            const newActivityData = {description, name};
            const newActivity = await createActivity(newActivityData)
            res.send(newActivity)
        }
    } catch (error){
        next({error});
    }
})

router.get("/:activityId/routines", async(req, res, next) => {
    const {activityId} = req.params;
    try {
        const activity = await getActivityById(activityId)
        if (!activity) {
            next({
                name: "ActivityNotFoundError",
                message: `Activity ${activityId} not found`,
                error: "ActivityNotFoundError"
            });
        }
        else {
            const publicRoutines = await getPublicRoutinesByActivity(activity)
            res.send(publicRoutines)
        }

    }  catch ({ name, message, error }) {
            next({ name, message, error });
            }
});

router.patch("/:activityId", requireUser, async(req, res, next) => {
    try {
        const {activityId} = req.params;
        const _activity = await getActivityById(activityId);
        if(!_activity) {
            next({
                error: "Error",
                message: `Activity ${activityId} not found`,
                name: 'NotFound'
            });
        } else {
            const {name, description} = req.body;
            const updatedActivity = await updateActivity({id: activityId, name, description})
            if(updatedActivity) {
            res.send(updatedActivity);
            } else {
                next({
                    error: "errorerr",
                    name: "Anything",
                    message: `Activity ${activityId}`
                })
            }
        }
        } catch ({error, name, message}) {
        next({
            error: "Same name as another activity",
            message: `An activity with name Aerobics already exists`,
            name: "Same name as another activity"
        });
        }
    });
    

module.exports = router