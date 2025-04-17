const db = require('../persistence');

module.exports = async (req, res) => {
    await db.updateTask(req.params.id, {
        title: req.body.title,
        description: req.body.description,
        //completed: req.body.completed,
    });
    const task = await db.getTask(req.params.id);
    res.send(task);
};
