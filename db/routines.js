const client = require("./client");



async function createRoutine({ creatorId, isPublic, name, goal }) {
  console.log("Creating routine...")

  try {
    const {rows: [routine] } = await client.query(`
      INSERT INTO routines (creatorId, isPublic, name, goal)
      values ($1, $2, $3, $4)
      returning *;
    `, [creatorId, isPublic, name, goal]);

    console.log(routine);
    console.log("Routine created!");

    return routine;

  } catch (error) {
    console.log(error);
    console.error("Cannot create routine.");
    throw error;
  }
};

async function getRoutineById(id) {}

async function getRoutinesWithoutActivities() {}

async function getAllRoutines() {}

async function getAllPublicRoutines() {}

async function getAllRoutinesByUser({ username }) {}

async function getPublicRoutinesByUser({ username }) {}

async function getPublicRoutinesByActivity({ id }) {}

async function updateRoutine({ id, ...fields }) {}

async function destroyRoutine(id) {}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
