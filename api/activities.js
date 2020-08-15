const express = require('express');
const activitiesRouter = express.Router();
const { requireUser } = require('./utils')
const {
    getAllActivities,
    createActivity,
    getPublicRoutinesByActivity
} = require('../db');


activitiesRouter.get('/', async (req, res) => {
    try {
        const activities = await getAllActivities();
        console.log(req.body);

        res.send({activities});
    } catch ({name, message}) {
        next({name, message});
    }
});

activitiesRouter.post('/', requireUser, async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const newActivity = await createActivity({name, description})
        res.send(newActivity)
    } catch ({name, message}) {
        next({name, message});
    }
});

activitiesRouter.get('/:activityId/routines', async (req, res) => {
    try {
        console.log(req.body, 'req body flag')

        const publicRoutinesByActivity = await getPublicRoutinesByActivity(req.params.activityId);

        res.send(publicRoutinesByActivity);
    } catch ({name, message}) {
        next({name, message});
    }
});


module.exports = activitiesRouter;