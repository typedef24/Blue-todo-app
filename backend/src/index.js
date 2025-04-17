const express = require('express');
const app = express();
const db = require('./persistence');
const getTasks = require('./routes/getTasks');
const addTask = require('./routes/addTask');
const updateTask = require('./routes/updateTask');
const deleteTask = require('./routes/deleteTask');

app.use(express.json());
app.use(express.static(__dirname + '/static'));

app.get('/api/tasks', getTasks);
app.post('/api/tasks', addTask);
app.put('/api/tasks/:id', updateTask);
app.delete('/api/tasks/:id', deleteTask);

db.init()
    .then(() => {
        app.listen(3000, () => console.log('Listening on port 3000'));
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });

const gracefulShutdown = () => {
    db.teardown()
        .catch(() => {})
        .then(() => process.exit());
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('SIGUSR2', gracefulShutdown); // Sent by nodemon
