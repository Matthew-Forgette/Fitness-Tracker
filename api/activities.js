const express = require('express');
const activitiesRouter = express.Router();
const { requireUser } = require('./utils')
const {
    getAllActivities,
    createActivity,
    getPublicRoutinesByActivity,
    getActivityById,
    updateActivity
} = require('../db');


activitiesRouter.get('/', async (req, res) => {
    try {
        const activities = await getAllActivities();

        res.send({activities});
    } catch ({name, message}) {
        next({name, message});
    }
});

activitiesRouter.post('/', requireUser, async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const newActivity = await createActivity({name, description})
        res.send(newActivity);
    } catch ({name, message}) {
        next({name, message});
    }
});

activitiesRouter.get('/:activityId/routines', async (req, res) => {
    try {
        const activityId = req.params.activityId
        const publicRoutinesByActivity = await getPublicRoutinesByActivity({activityId});

        res.send(publicRoutinesByActivity);
    } catch ({name, message}) {
        next({name, message});
    }
});

activitiesRouter.patch('/:activityId', requireUser, async (req, res, next) => {
    try {
        const activityId = req.params.activityId;
        const { name, description } = req.body;

        const updateFields = {};

        if (name) {
            updateFields.name = name;
        }

        if (description) {
            updateFields.description = description;
        }

        const updatedActivity = await updateActivity(activityId, updateFields);

        res.send({activity: updatedActivity})

    } catch ({name, message}) {
        next({name, message});
    }
})


module.exports = activitiesRouter;