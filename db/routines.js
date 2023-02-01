const client = require("./client");



async function createRoutine({ creatorId, isPublic, name, goal }) {
  console.log("Creating routine...")

  try {
    const {rows: [routine] } = await client.query(`
      INSERT INTO routines ("creatorId", "isPublic", name, goal)
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

async function getRoutinesWithoutActivities() {
  //  select and return an array of all routines
  // console.log("Selecting all routines without activities")

  try {
    const { rows: [routinesWithoutActivities]} = await client.query(`
      SELECT * FROM routines;
    `)

    // console.log("Routines without activities: ", routinesWithoutActivities)
    return routinesWithoutActivities;

  } catch (error) {
    console.log(error);
    console.error("Cannot select routines.");
    throw error;
  }

};


async function getAllRoutines() {
  // select and return an array of all routines, include their activities
  console.log("Getting all routines...")

  try {
    const {rows} = await client.query(`
      SELECT * FROM routines;
    `)


    console.log(rows);
    console.log("All routines gotten!")
    return rows;

  } catch (error) {
    console.log(error);
    console.error("Sorry, cannot get routines.");
    throw error;
  }
}

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
