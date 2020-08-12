const {
    createUser,
    getUser,
    getAllUsers,
    getUserByUsername,
    getAllActivities,
    createActivity,
    updateActivity,
    getAllRoutines,
    getPublicRoutines,
    getAllRoutinesByUser,
    getPublicRoutinesByActivity,
    createRoutine,
    updateRoutine,
    destroyRoutine,
    addActivityToRoutine,
    updateRoutineActivity,
    destroyRoutineActivity,
    testFunc
} = require('./index')

const client = require('./client')

async function createTables() {
    try {
      console.log("Starting to build tables...");
  
      await client.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          username varchar(255) UNIQUE NOT NULL,
          password varchar(255) NOT NULL
        );

        CREATE TABLE activities (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) UNIQUE NOT NULL,
          description TEXT NOT NULL
        );
  
        CREATE TABLE routines (
          id SERIAL PRIMARY KEY,
          "creatorId" INTEGER REFERENCES users(id),
          public BOOLEAN DEFAULT false,
          name VARCHAR(255) UNIQUE NOT NULL,
          goal TEXT NOT NULL
        );
  
        CREATE TABLE routine_activities (
          id SERIAL PRIMARY KEY,
          "routineId" INTEGER REFERENCES routines(id),
          "activityId" INTEGER REFERENCES activities(id),
          duration INTEGER,
          count INTEGER,
          UNIQUE ("routineId", "activityId")
        );
      `);
  
      console.log("Finished building tables!");
    } catch (error) {
      console.error("Error building tables!");
      throw error;
    }
}

async function dropTables() {
    try {
      console.log("Starting to drop tables...");
  
      await client.query(`
        DROP TABLE IF EXISTS routine_activities;
        DROP TABLE IF EXISTS activities;
        DROP TABLE IF EXISTS routines;
        DROP TABLE IF EXISTS users;
      `);
  
      console.log("Finished dropping tables!");
    } catch (error) {
      console.error("Error dropping tables!");
      throw error;
    }
}

async function createInitialUsers() {
    try {
        console.log('Starting to creat users...');

        const johnny = await createUser({
          username: 'Johnny_moi', 
          password: 'clownfish', 
          name: 'John Nemoy', 
          location: 'Jacksonville'
        });

        const tayla = await createUser({
          username: 'Ohtaylo', 
          password: 'kevin2cute', 
          name: 'Tayla Build', 
          location: 'Connecticut'
        });

        const nick = await createUser({
          username: 'Fl_zooted', 
          password: 'beenchillin', 
          name: 'Nick Pitz', 
          location: 'Jacksonville'
        });

        console.log(johnny, tayla, nick);

        console.log('Finished creating user!');
    } catch(error) {
        console.log("Error creating users!");
        throw error;
    }
}


async function createInitialActivities() {
    try {
  
      await createActivity({
        name: 'push-ups ',
        description: 'Raising and lowering your torso while in a prone position by bending and straightening your arms'
      });
  
      await createActivity({
        name: 'sit-ups ',
        description: 'Lifting and lowering your torso while lying on your back with your knees bent'
      });
  
      await createActivity({
        name: 'jumping jacks',
        description: `Alternating between two positions by jumping. 
        Position one: Standing with your legs together and hands by your side. 
        Position two: Standing with your legs apart and your arms raised above your head`
      });
    } catch(error) {
      throw error;
    }
}

async function createInitialRoutines() {
    try {
        const allUsers = await getAllUsers();
        const johnny = allUsers[0]
        const tayla = allUsers[1]
        const nick = allUsers[2]

        await createRoutine({
            creatorId: johnny.id,
            public: true,
            name: "Clown routine",
            goal: "Be able to swim like a clownfish"
        });

        await createRoutine({
            creatorId: tayla.id,
            public: true,
            name: "New city shake",
            goal: "Be looking good by the time I have to move"
        });

        await createRoutine({
            creatorId: nick.id,
            public: false,
            name: "Creative routine",
            goal: "Become a pro player"
        });

        
    } catch (error) {
        throw error;
    }
}

async function createInitialRoutineActivities() {
    try {
      await addActivityToRoutine({
        routineId: 1,
        activityId: 1,
        count: 10,
        duration: 5
      })

      await addActivityToRoutine({
        routineId: 2,
        activityId: 2,
        count: 5,
        duration: 10
      })

      await addActivityToRoutine({
        routineId: 3,
        activityId: 3,
        count: 10,
        duration: 10
      })

      await addActivityToRoutine({
        routineId: 1,
        activityId: 2,
        count: 5,
        duration: 5
      })

      await addActivityToRoutine({
        routineId: 2,
        activityId: 3,
        count: 10,
        duration: 5
      })
    } catch (error) {
      throw error;
    }
}

async function testDB() {
    try {
        console.log('Starting to test database...');

        // console.log('Calling getUser...');
        // const user = await getUser({username: "Johnny_moi", password: 'clownfish'});
        // console,log('Result:', user)

        console.log("Calling getAllUsers");
        const users = await getAllUsers();
        console.log("Result:", users);

        console.log('Calling getUserByUsername...');
        const johnnyTest = await getUserByUsername('Johnny_moi');
        console.log('Result:', johnnyTest);

        console.log('Calling getAllActivities...');
        const activities = await getAllActivities();
        console.log('Result:', activities);

        console.log('Calling updateAcitvities on activity[1]...');
        const updateActivityResult = await updateActivity( 1, { 
            name: 'New activity',
            description: 'New activity description'
        });
        console.log('Result:', updateActivityResult);

        console.log('Calling getAllRoutines...');
        const routines = await getAllRoutines();
        console.log('Results:', routines);

        console.log('Calling getPublicRoutines...');
        const publicRoutines = await getPublicRoutines();
        console.log('Results:', publicRoutines);

        console.log('Calling updateRoutines...');
        const [ johnny, tayla, nick ] = await getAllUsers();
        console.log(johnny, 'johnny flag')
        const updatedRoutine = await updateRoutine(1, {
            creatorId: johnny.id,
            public: false,
            name: "Closed clown routine**",
            goal: "Be able to swim like a clownfish"
        });
        console.log('Results:', updatedRoutine);

        console.log('Calling getAllRoutinesByUser...');
        const userRoutinesResult = await getAllRoutinesByUser({username: tayla.username});
        console.log('Result:', userRoutinesResult)

        console.log('Calling destroyRoutine...');
        const destroyRoutineResult = await destroyRoutine(1);
        console.log('Remaining routines:', await getAllRoutines());

        console.log("Calling addActivityToRoutine...");
        const addRoutineActivity = await addActivityToRoutine({
          routineId: 2,
          activityId: 3,
          count: 10,
          duration: 5
        })
        console.log('Result:', addRoutineActivity)

        

    } catch (error) {
        
    }
}

async function rebuildDB() {
    try {
      client.connect();
  
      await dropTables();
      await createTables();
      await createInitialUsers();
      await createInitialActivities();
      await createInitialRoutines();
      await createInitialRoutineActivities();
    } catch (error) {
      throw error;
    }
}

rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(() => client.end());