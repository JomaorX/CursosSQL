// Importar módulos necesarios
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));
const { query } = require('./database'); // Importa la función query
const PORT = process.env.PORT || 3000; // 3000 para local

// Ruta para obtener listado de cursos
app.get('/cursos', async (req, res) => {
    try {
        const results = await query('SELECT * FROM cursos');
        res.json(results);
    } catch (err) {
        console.error('Error obteniendo cursos:', err);
        res.status(500).json({ error: 'Error al obtener los cursos' });
    }
});

// Ruta para obtener listado de centros
app.get('/centros', async (req, res) => {
    try {
        const results = await query('SELECT * FROM centros');
        res.json(results);
    } catch (err) {
        console.error('Error obteniendo centros:', err);
        res.status(500).json({ error: 'Error al obtener los centros' });
    }
});

// Ruta para obtener alumnos por curso
app.get('/alumnos/:cursoId', async (req, res) => {
    try {
        const { cursoId } = req.params;
        const results = await query('SELECT * FROM alumnos WHERE curso_id = ?', [cursoId]);
        res.json(results);
    } catch (err) {
        console.error('Error obteniendo alumnos:', err);
        res.status(500).json({ error: 'Error al obtener los alumnos' });
    }
});

// Ruta para eliminar alumno
app.delete('/alumnos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await query('DELETE FROM alumnos WHERE id = ?', [id]);
        res.json({ message: 'Alumno eliminado correctamente' });
    } catch (err) {
        console.error('Error eliminando alumno:', err);
        res.status(500).json({ error: 'Error al eliminar el alumno' });
    }
});

// Ruta para actualizar información de un curso
app.put('/cursos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, nivel, lugar } = req.body;
        await query('UPDATE cursos SET nombre = ?, descripcion = ?, nivel = ?, lugar = ? WHERE id = ?', 
        [nombre, descripcion, nivel, lugar, id]);
        res.json({ message: 'Curso actualizado correctamente' });
    } catch (err) {
        console.error('Error actualizando curso:', err);
        res.status(500).json({ error: 'Error al actualizar el curso' });
    }
});

// Obtener el ratio de aprobados para gráficos
app.get('/estadisticas', async (req, res) => {
    try {
        const results = await query('SELECT c.nombre, COUNT(a.id) AS total, SUM(a.aprobado) AS aprobados FROM alumnos a JOIN cursos c ON a.curso_id = c.id GROUP BY c.id');
        res.json(results);
    } catch (err) {
        console.error('Error obteniendo estadísticas:', err);
        res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
