const db = require('../persistence');

module.exports = async (req, res) => {
    await db.removeTask(req.params.id);
    res.sendStatus(200);
};
