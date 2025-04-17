const db = require('../persistence');

module.exports = async (req, res) => {
    const task = {
        title: req.body.title,
        description: req.body.description,
    };

    await db.storeTask(task);
    res.send(task);
};
