const express = require('express');
const router = express.Router();
const { getAllPublicRoutines, createRoutine } = require('../db/routines')
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

// POST /api/routines/:routineId/activities

module.exports = router;
