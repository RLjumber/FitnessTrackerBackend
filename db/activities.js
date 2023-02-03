const client = require('./client');

// database functions
async function createActivity({ name, description }) {
  console.log("Creating activity...");
  // return the new activity
  
  try {
    const {rows: [activity] } = await client.query(`
      INSERT INTO activities (name, description)
      values ($1, $2)
      returning *;
    `, [name, description]);

    console.log(activity);
    console.log("Activity created");

    return activity;

  } catch (error) {
    console.error("Cannot create user");
    throw error;
  }
  
}

async function getAllActivities() {
  // select and return an array of all activities
  console.log("Getting all activities...")

  try {

    const {rows} = await client.query(`
      SELECT * FROM activities;
    `);

    console.log("Activities got!")
    console.log(rows)
    return rows;

  } catch (error) {
    console.error("Cannot get  all activities.");
    throw error;
  }

}

async function getActivityById(id) {
  console.log("getting activities by id...")
  try {
    const {rows: [activity]} = await client.query(`
    SELECT id, name, description
    FROM activities
    WHERE id=$1;
    `, [id]);

    console.log("Activity got!")
    console.log(activity)
    return activity;
  
  } catch (error) {
    console.log("Cannot get activies by id.")
    throw error;
  }
}

async function getActivityByName(name) {
  console.log("getting activities by name...")
  try {
    const { rows: [activity] } = await client.query(`
    Select id, name, description
    FROM activities
    WHERE name=$1;
    `, [name]);

    console.log("Activity got!")
    console.log(activity)
    return activity;

  } catch (error) {
    console.log("Cannot get activities by name.");
    throw error
  }
}

async function attachActivitiesToRoutines(routines) {
  // select and return an array of all activities
  try {
  const createRoutineActivitiesPromises = activities.map(
    activity => createActivity(activities.id, routines.id)
  );

  await Promise.all(createRoutineActivitiesPromises);

  return await getActivityById(id);
} catch (error) {
  console.log("failed to attach activities")
  throw error;
}
}


async function updateActivity({ id, fields = {} }) {
  // don't try to update the id
  // do update the name and description
  // return the updated activity
}


module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
