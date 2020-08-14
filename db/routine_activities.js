const client = require('./client');

async function getAllRoutineActivities() {
    try {
        const { rows } = await client.query(`SELECT * FROM routine_activities;`);

        return rows;
    } catch (error) {
        throw error;
    } 
}


async function addActivityToRoutine({ routineId, activityId, count, duration }) {
    try {
       const { rows: [routineActivity] } = await client.query(`
       INSERT INTO routine_activities("routineId", "activityId", count, duration)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT ("routineId", "activityId") DO NOTHING
       RETURNING *;
       `, [routineId, activityId, count, duration]);

       return routineActivity;
    } catch (error) {
        throw error;
    }
}

async function updateRoutineActivity(id, fields = {}) {
    const setString = Object.keys(fields).map(
        (key, index) => `"${ key }"=$${ index + 1 }`
      ).join(', ');

    if (setString.length === 0) {
        return;
    }

    try {
        const { rows: [routine_activity] } = await client.query(`
        UPDATE routine_activities
        SET ${setString}
        WHERE id=${id}
        RETURNING *;
        `, Object.values(fields));

        return routine_activity
    } catch (error) {
        throw error;
    }

}
//*
async function destroyRoutineActivity(id) {
    try {
        const { rows } = await client.query(`
        DELETE FROM routine_activities
        WHERE id=$1;
        `, [id]);

        return rows;
    } catch (error) {
        throw error;
    }

}

module.exports = {
    addActivityToRoutine,
    updateRoutineActivity,
    destroyRoutineActivity,
    getAllRoutineActivities
}