const client = require("./client");

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  console.log("Adding activity to routine...");

  try {
    const { rows: [routine_activity] } = await client.query(`
    INSERT INTO routine_activities ("routineId", "activityId", count, duration)
    values ($1, $2, $3, $4)
    returning *;
  `, [routineId, activityId, count, duration]);
    
    console.log(routine_activity);
    console.log("Activity added!");
    return routine_activity;

  } catch(error) {
    console.log(error);
    console.error(error);
  }

  // possibly use JOIN psql? this method works for now
}

async function getRoutineActivityById(id) {
  // console.log("Getting routine activity by id...");

  try {
    const {rows: [routineactivity]} = await client.query(`
    SELECT * FROM routine_activities
    WHERE id = $1;
    `, [id])

    // console.log(routineactivity);
    return routineactivity;

  } catch(error) {
    console.log(error);
    console.error(error);
  }
}

async function getRoutineActivitiesByRoutine({ id }) {
  // console.log("Getting routine activity by routine...");
  // select and return an array of all routine_activity records
  // unlike the above getRoutineActivityById(id), this function returns the routine activities based on the routineId not the main SERIAL primary key id 

  try {
    const { rows } = await client.query(`
    SELECT * FROM routine_activities
    WHERE "routineId" = $1;
    `, [id])

    // console.log("Activity by routine gotten: ");
    return rows;

  } catch(error) {
    console.log(error);
    console.error(error);
  }
}

async function updateRoutineActivity({ id, ...fields }) {
  const setString = Object.keys(fields).map(
    (key, index) => `"${key}"=$${index + 1}`
  ).join(', ');

  console.log("Updating routine activity...");

  try {
    if (setString.length > 0) {
      const { rows : [ routine_activity ]} = await client.query(`
        UPDATE routine_activities
        SET ${setString}
        WHERE id=${id}
        RETURNING *;
      `, Object.values(fields));

      console.log(routine_activity)
      return routine_activity;
    }

} catch (error) {
  console.log("failed to update routine activity!");
  throw error;
}
}

async function destroyRoutineActivity(id) {
  console.log("Destroying routine_activity...");

  try {
   const {rows : [routine_activity]} = await client.query(`
    DELETE FROM routine_activities
    WHERE id = $1
    RETURNING *;
    `, [id]);

    return routine_activity;

  } catch (error) {
    console.error("Failed to destroy routine_activity!")
  }
}

async function canEditRoutineActivity(routineActivityId, userId) { 


  const routineActivity = await getRoutineActivityById(routineActivityId);


  console.log(routineActivity.routineId);
  console.log(userId)

  if (routineActivity.routineId === userId) {
    return true;
  } else {
    return false
  }

}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
