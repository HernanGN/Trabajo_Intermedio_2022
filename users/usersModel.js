/* Aquí va el modelo de datos. Consultas a la Base de Datos. */

const res = require("express/lib/response")
const pool = require("../data/config")

const getAllUsers = () => {
    const query = "SELECT * FROM users"
    try {
        return pool.query(query)
    } catch (error) {
        //error.status = 500
        error.message = error.code
        return error
    }    
}

const getUserById = (id) => {
    const query = `SELECT * FROM users WHERE id = ${id}`
    try {
        return pool.query(query)
    } catch (error) {
        //console.log("Tuvimos un error", error)
        //return { "error": error.code }
        //error.status = 500
        error.message = error.code
        return error        
    }    
}

const registerUser = (user) => {
    const query = `INSERT INTO users SET ?`
    try {
        return pool.query(query, user)
    } catch (error) {
        //console.log("Tuvimos un error", error)
        //return { "error": error.code }
        //error.status = 500
        error.message = error.code
        return error
    }        
}

const loginUser = (email) => {
    const query = `SELECT * FROM users WHERE email = '${email}'`
    try {
        return pool.query(query)
    } catch (error) {
        //error.status = 500
        error.message = error.code
        return error
    }
}

const editUserById = (id, user) => {
    const query = `UPDATE users SET ? WHERE id = ${id}`;
    try {
        return pool.query(query, user)
    } catch (error) {
        //error.status = 500
        error.message = error.code
        return error
    }
}

const delUserById = (id) =>{
    const query = `DELETE FROM users WHERE id = ${id}`
    try {
        return pool.query(query, id)
    } catch (error) {
        //error.status = 500
        error.message = error.code
        return error
    }
}

module.exports = { getAllUsers, getUserById, registerUser, loginUser, editUserById, delUserById }