const express = require('express');
const usersRouter = express.Router();
const SALT_COUNT = 10;

const { 
  createUser,
  getAllUsers,
  getUserByUsername,
  getUser,
  getAllRoutinesByUser
} = require('../db');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

usersRouter.get('/', async (req, res, next) => {
    try {
      const users = await getAllUsers();
      res.send({
        users
      });
    } catch ({ name, message }) {
      next({ name, message });
    }
});

usersRouter.post('/register', async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password"
    });
  }
  
  try {
    const user = await getUserByUsername(username);

    if (user) {
      next({
        name: 'UserExistsError',
        message: 'A user by that username already exists'
      });
    } else {
      let securedPassword;

		  bcrypt.hash(password, SALT_COUNT, async (err, hashedPassword) => {
			  console.log(hashedPassword);
			  securedPassword = hashedPassword;
			  const newUser = await createUser({ username, password: securedPassword });
        // JWT stuff
        if (err) {
          next(err);
        } else {
          res.send({ message: 'User created', newUser});
        }
		  })
    }

	} catch (error) {
		next(error);
	}
});

usersRouter.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      next({
        name: "MissingCredentialsError",
        message: "Please supply both a username and password"
      });
    }

    const user = await getUser({username, password});
    console.log(user, 'inside /login route flag');

    res.send(user)
  } catch (error) {
    next(error);
  }
});

// usersRouter.get('/:username/routines', async (req, res, next) => {
//   try {
//     await 
//   } catch (error) {
//     next(error);
//   }
// });




module.exports = usersRouter;