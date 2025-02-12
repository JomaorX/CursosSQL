const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configuración de la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'formacion'
});

db.connect(err => {
    if (err) throw err;
    console.log('Conectado a la base de datos MySQL');
});

// Obtener todos los cursos
app.get('/cursos', (req, res) => {
    db.query('SELECT * FROM cursos', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Obtener todos los centros
app.get('/centros', (req, res) => {
    db.query('SELECT * FROM centros', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Obtener alumnos de un curso
app.get('/alumnos/:cursoId', (req, res) => {
    const { cursoId } = req.params;
    db.query('SELECT * FROM alumnos WHERE curso_id = ?', [cursoId], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Eliminar alumno
app.delete('/alumnos/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM alumnos WHERE id = ?', [id], (err, results) => {
        if (err) throw err;
        res.json({ message: 'Alumno eliminado correctamente' });
    });
});

// Obtener el ratio de aprobados para gráficos
app.get('/estadisticas', (req, res) => {
    db.query('SELECT c.nombre, COUNT(a.id) AS total, SUM(a.aprobado) AS aprobados FROM alumnos a JOIN cursos c ON a.curso_id = c.id GROUP BY c.id', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Iniciar el servidor
app.listen(3000, () => {
    console.log('Servidor ejecutándose en http://localhost:3000');
});
