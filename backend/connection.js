const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool({
  connectionLimit: 10,
  multipleStatements: true, // Allow multiple queries in one statement
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// Automatically create database and connect
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }

  const createSchemaSql = `
    CREATE TABLE IF NOT EXISTS questions (
      id INT PRIMARY KEY AUTO_INCREMENT,
      question_text VARCHAR(255),
      options JSON,
      correct_answer VARCHAR(255)
    );
    
    CREATE TABLE IF NOT EXISTS users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      first_name VARCHAR(255),
      last_name VARCHAR(255),
      email VARCHAR(255),
      password VARCHAR(255)
    );
  `;

  connection.query(createSchemaSql, (err) => {
    if (err) {
      console.error("Error creating schema:", err);
    }

    connection.release();
  });
});

module.exports = pool;
