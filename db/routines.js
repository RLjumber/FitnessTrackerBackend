const client = require("./client");
const { attachActivitiesToRoutines } = require("./activities")


async function createRoutine({ creatorId, isPublic, name, goal }) {
  console.log("Creating routine...")

  try {
    const {rows: [routine] } = await client.query(`
      INSERT INTO routines ("creatorId", "isPublic", name, goal)
      values ($1, $2, $3, $4)
      returning *;
    `, [creatorId, isPublic, name, goal]);

    // console.log(routine);
    console.log("Routine created!");

    return routine;

  } catch (error) {
    console.log(error);
    console.error("Cannot create routine.");
    throw error;
  }
}

async function getRoutineById(id) {
  try {
    const {rows: [routine]} = await client.query(`
    SELECT * FROM routines
    WHERE id = $1;
    `, [id])

    console.log(routine)
    return routine;
  } catch (error) {
    console.error("Cannot fetch Routine by Id")
    throw error
  }
}


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
    const { rows: routines } = await client.query(`
SELECT routines.*, users.username AS "creatorName"
FROM routines
JOIN users ON routines."creatorId"=users.id;
`);

    return attachActivitiesToRoutines(routines);
  } catch (error) {
    console.error;
    throw error;
  }
}


async function getAllPublicRoutines() {
  try {
    const { rows: routines } = await client.query(`
SELECT routines.*, users.username AS "creatorName"
FROM routines
JOIN users ON routines."creatorId"=users.id
WHERE "isPublic"='true';
`);

    return attachActivitiesToRoutines(routines);
  } catch (error) {
    console.error;
    throw error;
  }
}

async function getAllRoutinesByUser({ username }) {
  try {
    const { rows: routines } = await client.query(`
SELECT routines.*, users.username AS "creatorName"
FROM routines
JOIN users ON routines."creatorId"=users.id
WHERE "username"=$1;
`, [username]);

    return attachActivitiesToRoutines(routines);
  } catch (error) {
    console.error;
    throw error;
  }
}

async function getPublicRoutinesByUser({ username }) {
  try {
    const { rows: routines } = await client.query(`
SELECT routines.*, users.username AS "creatorName"
FROM routines
JOIN users ON routines."creatorId"=users.id
WHERE "isPublic"='true' AND "username"=$1;
`, [username]);

    return attachActivitiesToRoutines(routines);
  } catch (error) {
    console.error;
    throw error;
  }
}

async function getPublicRoutinesByActivity({ id }) {}

async function updateRoutine({ id, ...fields }) {}

async function destroyRoutine(id) {
  console.log("Destroying routine...");

  try {
    await client.query(`
    DELETE FROM routine_activities
    WHERE "routineId"=$1;
    `, [id]);

  await client.query(`
    DELETE FROM routines
    WHERE id = $1
    `, [id]);



  } catch (error) {
    console.error("Failed to destroy routine_activity!")
  }
}

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
