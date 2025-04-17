const db = require('../persistence');

module.exports = async (req, res) => {
    const tasks = await db.getTasks();
    res.send(tasks);
};
