require('dotenv').config();
const mysql = require('mysql');

const dbConfig = {
    host: process.env.MYSQL_ADDON_HOST,
    user: process.env.MYSQL_ADDON_USER,
    password: process.env.MYSQL_ADDON_PASSWORD,
    database: process.env.MYSQL_ADDON_DB,
    port: process.env.MYSQL_ADDON_PORT,
    connectionLimit: 10, // Límite de conexiones simultáneas
    queueLimit: 0 // Sin límite de espera en la cola de conexiones
};

const pool = mysql.createPool(dbConfig);

// Función para ejecutar consultas con manejo de reconexión
const query = (sql, values = []) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.error('Error obteniendo conexión de MySQL:', err);
                reject(err);
                return;
            }

            connection.query(sql, values, (error, results) => {
                connection.release(); // Liberamos la conexión después de la consulta

                if (error) {
                    console.error('Error ejecutando consulta MySQL:', error);
                    reject(error);
                    return;
                }

                resolve(results);
            });
        });
    });
};

module.exports = { query };
