const mysql = require("mysql2")

const util = require("util")

const pool = mysql.createPool({
/*  host: "localhost",
    datebase: "api",
    user: "root",
    pass: ""*/
    host: process.env.db_host,
    database: process.env.db_name,
    user: process.env.db_user,
    password: process.env.db_pass,
    /* Para Mac
    password: process.env.password,
    socketPath: process.env.db_socket,
    port: process.env.db_port, */
})

pool.getConnection((err) => {
    err ? console.warn("No conectado", { "error": err.message }) : console.log("Conexión con BD establecida")
})

pool.query = util.promisify(pool.query)

module.exports = pool