const express = require('express');
const router = express.Router();
const { requireUser } = require("./utility");
const {
  updateRoutineActivity,
  getRoutineActivityById,
  getRoutineById,
  destroyRoutineActivity,
//   canEditRoutineActivity,
} = require("../db");

// PATCH /api/routine_activities/:routineActivityId

router.patch("/:routineActivityId", requireUser, async (req, res, next) => {
    const { duration, count } = req.body;
    const id = req.params.routineActivityId;
    console.log("123", req.params);


    try {
      const routineActivity = await getRoutineActivityById(id);
      const routineById = await getRoutineById(routineActivity.routineId);
      console.log("routine activity to be patched: ", routineActivity);
    //   console.log("GO BIRDS", req.user)
      console.log("routines: ", routineById);
  
      if (!routineActivity) {
        next({
          message: `Couldn't find routineActivityId = ${id}`,
          error: "RoutineActivityNotFound",
          name: "RoutineActivityNotFound",
        });
      } else if (req.user && routineById.creatorId != req.user.id) {
          res.status(403).send({
            message: `User ${req.user.username} is not allowed to update In the evening`,
            error: "UserNotCreatorError",
            name: "UserNotCreatorError"
          })
      } else {
        const updatedRoutineActivity = await updateRoutineActivity({
          id,
          count,
          duration,
        });

        console.log("updated routineActivity!", updatedRoutineActivity);
        res.send(updatedRoutineActivity);
      }
    } catch (error) {
      next(error);
    }
  });

// DELETE /api/routine_activities/:routineActivityId

router.delete("/:routineActivityId", requireUser, async (req, res, next) => {
    const id = req.params.routineActivityId;
    try {
      const routineActivity = await getRoutineActivityById(id);
      const routineById = await getRoutineById(routineActivity.routineId);
      console.log("routine activity to be deleted: ", routineActivity);
      console.log("routines: ", routineById);
  
      if (!routineActivity) {
        next({
          message: `Couldn't find routineActivityId = ${id}`,
          error: "RoutineActivityNotFound",
          name: "RoutineActivityNotFound",
        });
      } else if (req.user && routineById.creatorId != req.user.id) {
        res.status(403).send({
          message: `User ${req.user.username} is not allowed to delete In the afternoon`,
          error: "UserNotCreatorError",
          name: "UserNotCreatorError"
        })
    }
      const deletedRoutineActivity = await destroyRoutineActivity(id);
      res.send(deletedRoutineActivity);
    } catch (error) {
      next(error);
    }
  });



module.exports = router;
