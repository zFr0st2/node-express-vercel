require('dotenv').config()


const API_KEY = process.env.API_KEY
const apiKeyNice = (req, res, next) => {
    const useApi = req.get('x-api-key');
    if (useApi && useApi === API_KEY) {
        next();
    } else {
        res.status(401).send('Llave Invalida')
    }
    
};

// const swaggerUI = require('swagger-Uint16Array.express')
// const swaggerJsdoc = require('swagger-jsdoc')
const express = require('express');
const { Pool } = require('pg');
const app = express();
app.use(express.json());
app.use(apiKeyNice);
const port = 3000;

const pool = new Pool({
    user: 'default',
    host: 'ep-frosty-morning-03950095-pooler.us-east-1.postgres.vercel-storage.com',
    database: 'verceldb',
    password: 'UJO5ilrY0xLP',
    port: 5432,
    ssl: {rejectUnauthorized: false}
});

app.get('/students', function(req, res){
    const listUsersQuery = `SELECT * FROM students;`;
    

pool.query(listUsersQuery)
    .then(data => {
        console.log("List students: ", data.rows);
        res.status(201).send(data.rows)
    })
    .catch(err => {
        console.error(err);
    });
});

app.get('/students/:id', function(req, res){
    const id= req.params.id
    const listUsersQuery = `SELECT * FROM students where id=${id};`
    console.log(listUsersQuery)

pool.query(listUsersQuery)
    .then(data => {
        console.log("List students: ", data.rows);
        res.status(201).send(data.rows)
    })
    .catch(err => {
        res.status(502).send('Vaya, parece que se ha producido un error')
        console.error(err);
    });
});

app.post('/students' , function(req, res){
    const id= req.body.id
    const name = req.body.name
    const lastname = req.body.lastname;
    const notes = req.body.notes
    const insertar = `INSERT INTO students(id, name, lastname,notes) VALUES(${id}, '${name}', '${lastname}', '${notes}')`
    pool.query(insertar)
    .then(() => {        
        res.status(201).send('Registro Guardado!')
    })
    .catch(err => {
        res.status(502).send('Vaya, parece que se ha producido un error')
        console.error(err);
    });
})

app.put('/students/:id', (req, res) => {
    const id = req.params.id;
    const name = req.body.name
    const lastname = req.body.lastname
    const notes = req.body.notes
    const modificar = `UPDATE students SET name = '${name}', lastname='${lastname}', notes='${notes}' WHERE id = ${id} `
    pool.query(modificar)
    .then(() => {        
        res.status(201).send('Registro Actualizado!')
    })
    .catch(err => {
        res.status(502).send('Vaya, parece que se ha producido un error')
        console.error(err);
    });
});

app.delete('/students/:id', (req, res) => {
    const id = req.params.id;
    const eliminar = `DELETE FROM students WHERE id=${id}`
    pool.query(eliminar)
    .then(() => {        
        res.status(204).send('Borraste el Registro!')
    })
    .catch(err => {
        res.status(502).send('Vaya, parece que se ha producido un error')
        console.error(err);
    }); 
});
app.listen(port, function(){
    console.log('Welcome student, the server is now on')
});