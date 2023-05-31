
const express = require('express');
const app = express();
app.use(express.json());
const dotenv = require('dotenv');
dotenv.config();

const bodyParser = require("body-parser");
app.use(bodyParser.json());
const itemsPool = require('./DBConfig');

app.get('/users', async(req, res) => {
    try {
        const allItems = await itemsPool.query(
            'SELECT * FROM users'
        );
        const rows = allItems.rows;
        res.json(rows);
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message)
    }
})

app.get('/users/:id', async(req, res) => {
    try {
        const allItems = await itemsPool.query(
            'SELECT * FROM users WHERE id=$1', [req.params.id]
        );
        const rows = allItems.rows;
        res.json(rows);
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message)
    }
})



app.post('/users', async (req, res) => {
    const { id, username, password, email, phone_number, date_of_birth } = req.body;
    try {
        const newItem = await itemsPool.query(
            'INSERT INTO users (id, username, password, email, phone_number, date_of_birth,created_on) VALUES ($1, $2, $3, $4, $5,$6,$7) RETURNING *',
            [id, username, password, email, phone_number, date_of_birth,date_of_birth]
        );
        res.json({ 
            message: "New item added in to the table!",
            item: newItem.rows
         });
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message)
    }
})

app.put('/users/:id', async(req, res) => {
    const { username, password, email, phone_number, date_of_birth } = req.body;
    try {
        const result = await itemsPool.query(
            'UPDATE users SET username=$1, password=$2, email=$3, phone_number=$4, date_of_birth=$5 WHERE id=$6',
            [username, password, email, phone_number, date_of_birth, req.params.id]
        );
        res.json({ message: `User with ID ${req.params.id} updated successfully` });
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message)
    }
})

app.delete('/users/:id', async(req, res) => {
    try {
        const result = await itemsPool.query(
            'DELETE FROM users WHERE id=$1', [req.params.id]
        );
        res.json({ message: `User with ID ${req.params.id} deleted successfully` });
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message)
    }
})


app.listen(5070, () => {
    console.log("Server running on port 5070");
})

