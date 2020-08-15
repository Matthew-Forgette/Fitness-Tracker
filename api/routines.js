const express = require('express');
const routinesRouter = express.Router();

const {
    getAllRoutines
} = require('../db');

routinesRouter.get('/', async (req, res) => {
    try {
        const routines = await getAllRoutines();

        res.send(routines);
    } catch ({name, message}) {
        next({name, message});
    }
});

routinesRouter.post('/:routineId/activities', async (req, res, next) => {
    try {
        
    } catch ({name, message}) {
        next({name, message})
    }
});


module.exports = routinesRouter;