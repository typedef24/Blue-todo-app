const waitPort = require('wait-port');
const fs = require('fs');
const mysql = require('mysql2');

const {
    MYSQL_HOST: HOST,
    MYSQL_HOST_FILE: HOST_FILE,
    MYSQL_USER: USER,
    MYSQL_USER_FILE: USER_FILE,
    MYSQL_PASSWORD: PASSWORD,
    MYSQL_PASSWORD_FILE: PASSWORD_FILE,
    MYSQL_DB: DB,
    MYSQL_DB_FILE: DB_FILE,
} = process.env;

let pool;

async function init() {
    const host = HOST_FILE ? fs.readFileSync(HOST_FILE) : HOST;
    const user = USER_FILE ? fs.readFileSync(USER_FILE) : USER;
    const password = PASSWORD_FILE ? fs.readFileSync(PASSWORD_FILE) : PASSWORD;
    const database = DB_FILE ? fs.readFileSync(DB_FILE) : DB;

    await waitPort({
        host,
        port: 3306,
        timeout: 10000,
        waitForDns: true,
    });

    pool = mysql.createPool({
        connectionLimit: 5,
        host,
        user,
        password,
        database,
        charset: 'utf8mb4',
    });

    return new Promise((acc, rej) => {
        pool.query(
            'CREATE TABLE IF NOT EXISTS Todo_tasks (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255), description TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, completed BOOLEAN DEFAULT 0) DEFAULT CHARSET utf8mb4',
            (err) => {
                if (err) return rej(err);

                console.log(`Connected to mysql db at host ${HOST}`);
                acc();
            },
        );
    });
}

async function teardown() {
    return new Promise((acc, rej) => {
        pool.end((err) => {
            if (err) rej(err);
            else acc();
        });
    });
}

// get all pending tasks, order by last updated
async function getTasks() {
    return new Promise((acc, rej) => {
        //pool.query('SELECT * FROM Todo_tasks WHERE completed = 0 ORDER BY updated_at', (err, rows) => {
        pool.query('SELECT * FROM Todo_tasks ORDER BY updated_at DESC', (err, rows) => {
            if (err) return rej(err);
            acc(rows);
        });
    });
}

// get a particular task
async function getTask(id) {
    return new Promise((acc, rej) => {
        pool.query('SELECT * FROM Todo_tasks WHERE id=?', [id], (err, rows) => {
            if (err) return rej(err);
            acc(rows[0]);   //I want the task object not an array containing just the object hence the rows[0]
        });
    });
}

// Save task to DB
async function storeTask(task) {
    return new Promise((acc, rej) => {
        pool.query(
            'INSERT INTO Todo_tasks (title, description) VALUES (?, ?)',
            [task.title, task.description],
            (err) => {
                if (err) return rej(err);
                acc();
            },
        );
    });
}

// Edit a particular task
async function updateTask(id, task) {
    return new Promise((acc, rej) => {
        pool.query(
            'UPDATE Todo_tasks SET title=?, description=? WHERE id=?',
            [task.title, task.description, id],
            (err) => {
                if (err) return rej(err);
                acc();
            },
        );
    });
}

// Delete particular task
async function removeTask(id) {
    return new Promise((acc, rej) => {
        pool.query('DELETE FROM Todo_tasks WHERE id = ?', [id], (err) => {
            if (err) return rej(err);
            acc();
        });
    });
}

module.exports = {
    init,
    teardown,
    getTasks,
    getTask,
    storeTask,
    updateTask,
    removeTask,
};
