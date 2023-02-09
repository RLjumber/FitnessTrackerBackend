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
    SELECT *
    FROM activities
    WHERE id=$1;
    `, [id]);

    console.log("Activity got!")
    console.log(activity)
    return activity;
  
  } catch (error) {
    console.log("Cannot get activity by id.")
    throw error;
  }
}

async function getActivityByName(name) {
  console.log("getting activities by name...")
  try {
    const { rows: [activity] } = await client.query(`
    Select *
    FROM activities
    WHERE name=$1;
    `, [name]);

    console.log("Activity got!")
    console.log(activity)
    return activity;

  } catch (error) {
    console.log("Cannot get activity by name.");
    throw error
  }
}

async function attachActivitiesToRoutines(routines) {
  try {
    const routineIds = routines.map((routine) => routine.id);

    const setString = routines
      .map((routine, index) => `$${index + 1}`)
      .join(", ");

    const { rows: activities } = await client.query(
      `
          SELECT activities.*, routine_activities.duration, routine_activities.count, routine_activities.id AS "routineActivityId", routine_activities."routineId"
          FROM activities
          JOIN routine_activities ON routine_activities."activityId" = activities.id
          WHERE routine_activities."routineId"
          IN (${setString});
        `,
      routineIds
    );

    routines.forEach((routine) => {
      routine.activities = activities.filter(
        (activity) => activity.routineId === routine.id
      );
    });

    return routines;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function updateActivity({ id, ...fields}) {

  const setString = Object.keys(fields).map(
    (key, index) => `"${key}"=$${index + 1}`
  ).join(', ');

  try {
    if (setString.length > 0) {
      const { rows : [ activity ]} = await client.query(`
        UPDATE activities
        SET ${setString}
        WHERE id=${id}
        RETURNING *;
      `, Object.values(fields));
    
      return activity
    }

} catch (error) {
  console.log("failed to update activity!");
  throw error;
}

}
module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
