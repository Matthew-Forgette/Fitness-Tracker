const client = require('./client');


async function getAllActivities() {
    try {
        const { rows } = await client.query(`SELECT * FROM activities;`);

        return rows;
    } catch (error) {
        throw error;
    } 
}

async function createActivity({ name, description }) {
    try {
        const { rows: [activity] } = await client.query(`
        INSERT INTO activities(name, description)
        VALUES($1, $2)
        ON CONFLICT (name) DO NOTHING
        RETURNING *;
        `, [name, description]);

        return activity;
    } catch (error) {
        throw error;
    }

}

async function updateActivity( id, fields = {} ) {
    console.log('early return flag')  

    const { activities } = fields
    delete fields.activities


    const setString = Object.keys(fields).map(
        (key, index) => `"${ key }"=$${ index + 1 }`
      ).join(', ');

    if (setString.length === 0) {
        
        return;
    } 
    console.log(setString, 'set string flag')
    try {
        const { rows: [activity] } = await client.query(`
        UPDATE activities
        SET ${setString}
        WHERE id=${id}
        RETURNING *;
        `, Object.values(fields));

        return activity;
    } catch (error) {
        throw error;
    }

    
}

module.exports = {
    getAllActivities,
    createActivity,
    updateActivity
}
