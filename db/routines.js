const client = require('./client')
const {getUserByUsername} = require('./users')


async function getAllRoutines() {
    try {
        const { rows } = await client.query(`SELECT * FROM routines;`);

        return rows;
    } catch (error) {
        throw error;
    } 
}

async function getPublicRoutines() {
    try {
        const { rows } = await client.query(`
        SELECT * FROM routines WHERE public=true;
        `);

        return rows;
    } catch (error) {
        throw error;
    }
}



async function getAllRoutinesByUser({ username }) {
    try {
        const user = await getUserByUsername(username);

        console.log(username, 'user in allRoutinesByUser');

        const { rows: routines } = await client.query(`
        SELECT * FROM routines
        WHERE "creatorId"=$1;
        `, [user.id]);

        for (i = 0; i < routines.length; i++ ) {
            const routine = routines[i];
            routine.activities = await getActivityByRoutineId(routine.id);

        }
        
        return routines;
    } catch (error) {
        throw error;
    }
}

async function getPublicRoutinesByUser({ username }) {
    try {
        console.log('entry')
        console.log(username, 'user in allPublicRoutinesByUser');

        const user = await getUserByUsername(username);
        console.log(user, 'user flag(public)')


        const { rows: routines } = await client.query(`
        SELECT * FROM routines
        WHERE "creatorId"=$1
        AND public=true;
        `, [user.id]);

        for (i = 0; i < routines.length; i++ ) {
            const routine = routines[i];
            routine.activities = await getActivityByRoutineId(routine.id);

        }
        
        return routines;
    } catch (error) {
        throw error;
    }
}

async function getActivityByRoutineId(routineId) {
    try {
        const { rows: activity } = await client.query(`
        SELECT * FROM activities 
        JOIN routine_activities 
        ON routine_activities."activityId"=activities.id
        WHERE routine_activities."routineId"=$1;
        `, [routineId]);

        return activity;
    } catch (error) {
        throw error;
    }
}

async function getPublicRoutinesByActivity({ activityId }) {
    try {
        const { rows: routines } = await client.query(`
        SELECT * FROM routines
        JOIN routine_activities
        ON routine_activities."routineId"=routines.id
        WHERE routine_activities."activityId"=$1
        AND routines.public=true;
        `, [activityId]);

        for (i = 0; i < routines.length; i++ ) {
            const routine = routines[i];
            routine.activities = await getActivityByRoutineId(routine.id);

        }
        
        return routines;
    } catch (error) {
        throw error;
    }
}

async function createRoutine({ creatorId, public, name, goal }) {
    try {
        const { rows: [routine] } = await client.query(`
        INSERT INTO routines("creatorId", public, name, goal)
        VALUES($1, $2, $3, $4)
        ON CONFLICT (name) DO NOTHING
        RETURNING *
        `, [creatorId, public, name, goal]);

        return routine;
    } catch (error) {
        throw error;   
    }

}

async function updateRoutine(id,  fields = {} ) {

    const setString = Object.keys(fields).map(
        (key, index) => `"${ key }"=$${ index + 1 }`
      ).join(', ');

    if (setString.length === 0) {
        return;
    } 

    try {
        const { rows: [routine] } = await client.query(`
        UPDATE routines
        SET ${setString}
        WHERE id=${id}
        RETURNING *;
        `, Object.values(fields));

        return routine;
    } catch (error) {
        throw error;
    }
}
//*
async function destroyRoutine(id) {
    try {
        /* This query must be first because the routine_activity table
        depends on the routine table */
        await client.query(`
        DELETE FROM routine_activities
        WHERE "routineId"=$1;
        `, [id])

        const { rows } = await client.query(`
        DELETE FROM routines
        WHERE id=$1
        RETURNING *;
        `, [id]);

        return rows;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getAllRoutines,
    getPublicRoutines,
    getAllRoutinesByUser,
    getPublicRoutinesByUser,
    getPublicRoutinesByActivity,
    createRoutine,
    updateRoutine,
    destroyRoutine
}