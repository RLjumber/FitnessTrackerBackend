const express = require('express');
const router = express.Router();
const { getAllPublicRoutines, createRoutine, destroyRoutine, getRoutineById, updateRoutine } = require('../db/routines')
const { addActivityToRoutine } = require('../db/routine_activities')
const { getUserById } = require("../db/users")
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
    const { id } = req.user;
    const { isPublic, name, goal } = req.body;
  
    try {
      const creatorId = id;
      const newRoutine = await createRoutine({ creatorId, isPublic, name, goal });
      res.send(newRoutine);
    } catch (error) {
      next(error);
    }
  });
// PATCH /api/routines/:routineId
router.patch("/:routineId", requireUser, async (req, res, next) => {
  try {
    const { routineId } = req.params;
    const currentUser = req.user;
    const routine = await getRoutineById(routineId);
    if (req.user && routine.creatorId === req.user.id) {
      const updatedRoutine = await updateRoutine({
        id: routineId,
        ...req.body,
      });
      res.send(updatedRoutine);
    } else if (routine.creatorId !== currentUser.id) {
      res.status(403);
      next({
        error: "Error",
        message: `User ${req.user.username} is not allowed to update Every day`,
        name: "Error",
      });
    }
  } catch (error) {
    next(error);
  }
});

// DELETE /api/routines/:routineId
router.delete("/:routineId", requireUser, async (req, res, next) => {
    try {
      const { routineId } = req.params;
      const currentUser = req.user;
  
      const routine = await getRoutineById(routineId);
      if (routine && routine.creatorId === req.user.id) {
        const routineDelete = await destroyRoutine(routineId);
        res.send({ routineDelete, ...routine });
      } else if (routine.createdBy !== currentUser.id) {
        res.status(403);
        next({
          error: "Error",
          message: `User ${req.user.username} is not allowed to delete On even days`,
          name: "Error",
        });
      }
    } catch (error) {
      next(error);
    }
  });

// POST /api/routines/:routineId/activities
router.post("/:routineId/activities", async (req, res, next) => {
    try {
      const { routineId } = req.params;
      const { activityId, count, duration } = req.body;
  
      const routineActivityAttach = await addActivityToRoutine({
        routineId,
        activityId,
        count,
        duration,
      });
  
      if (routineActivityAttach) {
        res.send(routineActivityAttach);
      } else {
        next({
          error: "Error",
          message: `Activity ID ${activityId} already exists in Routine ID ${routineId}`,
          name: "Error",
        });
      }
    } catch (error) {
      next(error);
    }
  });

module.exports = router;
