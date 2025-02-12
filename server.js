// Importar módulos necesarios
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));
const db = require('./database');
const PORT = process.env.PORT || 3000; //3000 para local


// Ruta para obtener listado de cursos
app.get('/cursos', (req, res) => {
    db.query('SELECT * FROM cursos', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Ruta para obtener listado de centros
app.get('/centros', (req, res) => {
    db.query('SELECT * FROM centros', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Ruta para obtener alumnos por curso
app.get('/alumnos/:cursoId', (req, res) => {
    const { cursoId } = req.params;
    db.query('SELECT * FROM alumnos WHERE curso_id = ?', [cursoId], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Ruta para eliminar alumno
app.delete('/alumnos/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM alumnos WHERE id = ?', [id], (err, results) => {
        if (err) throw err;
        res.json({ message: 'Alumno eliminado correctamente' });
    });
});

// Ruta para actualizar información de un curso
app.put('/cursos/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, nivel, lugar } = req.body;
    db.query('UPDATE cursos SET nombre = ?, descripcion = ?, nivel = ?, lugar = ? WHERE id = ?', 
    [nombre, descripcion, nivel, lugar, id], (err, results) => {
        if (err) throw err;
        res.json({ message: 'Curso actualizado correctamente' });
    });
});

// Obtener el ratio de aprobados para gráficos
app.get('/estadisticas', (req, res) => {
    db.query('SELECT c.nombre, COUNT(a.id) AS total, SUM(a.aprobado) AS aprobados FROM alumnos a JOIN cursos c ON a.curso_id = c.id GROUP BY c.id', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Iniciar servidor
app.listen(PORT , () => {
    console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
