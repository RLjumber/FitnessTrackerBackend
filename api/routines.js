const express = require('express');
const router = express.Router();
const { getAllPublicRoutines, createRoutine, destroyRoutine, getRoutineById } = require('../db/routines')
const { addActivityToRoutine } = require('../db/routine_activities')
const { requireUser } = require('./utility')

// GET /api/routines
router.get("/", async (req, res, next) => {
    try {
      const response = await getAllPublicRoutines();
  
      res.send(response);
    } catch (error) {
      next(error);
    }
  });

// POST /api/routines
router.post("/", requireUser, async (req, res, next) => {
    try {
      const { isPublic, name, goal } = req.body;
      const creatorId = req.user.id;
      const response = await createRoutine({ creatorId, isPublic, name, goal });
      res.send(response);
    } catch (error) {
      next(error);
    }
  });

// PATCH /api/routines/:routineId

// DELETE /api/routines/:routineId
router.delete("/:routineId", requireUser, async (req, res, next) => {
    const { routineId } = req.params;
  
    try {
      const response = await getRoutineById(routineId);
      const { name } = response;
      const routineCreatorId = response.creatorId;
  
      if (routineCreatorId === req.user.id) {
        await destroyRoutine(routineId);
  
        res.send(response);
      } else {
        next({
          error: "Error!",
          name: "NotCreatorOfRoutine",
          message: `User ${req.user.username} is not allowed to delete ${name}`,
          status: 403,
        });
      }
    } catch (error) {
      next(error);
    }
  });

// POST /api/routines/:routineId/activities
router.post("/:routineId/activities", async (req, res, next) => {
    const { routineId, activityId, count, duration } = req.body;
    try {
      const response = await addActivityToRoutine({
        routineId,
        activityId,
        count,
        duration,
      });
      response
        ? res.send(response)
        : next({
            error: "Error!",
            message: `Activity ID ${activityId} already exists in Routine ID ${routineId}`,
            name: "CanNotDuplicateActivity/RoutineId",
          });
    } catch (error) {
      next(error);
    }
  });

module.exports = router;
