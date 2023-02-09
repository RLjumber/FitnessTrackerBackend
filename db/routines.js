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

}


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

async function getPublicRoutinesByActivity({ id }) {

  try {
    const { rows: routines } = await client.query(`
      SELECT routines.*, users.username AS "creatorName", routine_activities."activityId"
      FROM routines
      JOIN users ON routines."creatorId" = users.id
      JOIN routine_activities ON routines.id = routine_activities."routineId"
      WHERE "isPublic"='true' AND "activityId"=$1;
    `, [id]);

    return attachActivitiesToRoutines(routines);
  } catch (error) {
    console.error;
    throw error;
  }
}

async function updateRoutine({ id, ...fields }) {
  const setString = Object.keys(fields).map(
    (key, index) => `"${key}"=$${index + 1}`
  ).join(', ');

  try {
    if (setString.length > 0) {
      const { rows : [ routine ]} = await client.query(`
        UPDATE routines
        SET ${setString}
        WHERE id=${id}
        RETURNING *;
      `, Object.values(fields));

      return routine;
    }

} catch (error) {
  console.log("failed to update routines");
  throw error;
}
}

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
