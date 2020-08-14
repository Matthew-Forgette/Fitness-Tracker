const express = require('express');
const usersRouter = express.Router();

const { 
  createUser,
  getAllUsers,
  getUserByUsername,
} = require('../db');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

usersRouter.get('/', async (req, res) => {
    try {
      const users = await getAllUsers();
      console.log(req.body)
      res.send({
        users
      });
    } catch ({ name, message }) {
      next({ name, message });
    }
});

usersRouter.post('/users/register', async (req, res, next) => {
  const { username, password } = req.body;
  
  try {

    let securedPassword;

		bcrypt.hash(password, SALT_COUNT, async (err, hashedPassword) => {
			console.log(hashedPassword);
			securedPassword = hashedPassword;
			const newUser = await createUser({ username, password: securedPassword });
      // JWT stuff
      
			res.send({ message: 'User created', token: '09ikefjHJ8u7e'});
		})

	} catch (error) {
		next(error);
	}
});




module.exports = usersRouter;