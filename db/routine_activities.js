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

}

async function getRoutineActivityById(id) {}

async function getRoutineActivitiesByRoutine({ id }) {}

async function updateRoutineActivity({ id, ...fields }) {}

async function destroyRoutineActivity(id) {}

async function canEditRoutineActivity(routineActivityId, userId) {}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
