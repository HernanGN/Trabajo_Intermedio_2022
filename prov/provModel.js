/* Aquí va el modelo de datos. Consultas a la Base de Datos. */

const res = require("express/lib/response")
const pool = require("../data/config")

// 1 - Get All Providers
const getAllProv = () => {
    const query = "SELECT * FROM prestadores"
    try {
        return pool.query(query)
    } catch (error) {
        error.message = error.code
        return error
    }    
}

// 2 - Get Provider By Id
const getProvById = (id) => {
    const query = `SELECT * FROM prestadores WHERE idprestador = ${id}`
    try {
        return pool.query(query)
    } catch (error) {
        error.message = error.code
        return error        
    }    
}

// 3 - Add Provider
const addProv = (prov) => {
    const query = `INSERT INTO prestadores SET ?`
    try {
        return pool.query(query, prov)
    } catch (error) {
        error.message = error.code
        return error
    }        
}

// Agregar Uno - Luego Borrar este Código
const agregarUnooo = async (user) => {
    const query = `INSERT INTO prestadores SET ?`
    try {
        return await pool.query(query, user)
    } catch (error) {
        //console.log("Tuvimos un error", error)
        return { "error": error.code }
    }        
}

// Register new prov - Luego Borrar este Código
const registerProv = async (prov) => {
    const query = `INSERT INTO prestadores SET ?`
    try {
        return await pool.query(query, prov)
    } catch (error) {
        //console.log("Tuvimos un error", error)
        //return { "error": error.code }
        //error.status = 500
        error.message = error.code
        return error
    }        
}

// 4 - Edit Provider By Id
const editProvById = (id, prov) => {
    const query = `UPDATE prestadores SET ? WHERE idprestador = ${id}`;
    try {
        return pool.query(query, prov)
    } catch (error) {
        error.message = error.code
        return error
    }
}

// 5 - Delete Provider By Id
const delProvById = (id) => {
    const query = `DELETE FROM prestadores WHERE idprestador = ${id}`
    try {
        return pool.query(query, id)
    } catch (error) {
        error.message = error.code
        return error
    }
}

// 6a - Get Provider By Name
const getProvByName = (string) => {
    const query = `SELECT * FROM prestadores WHERE nombre LIKE '%${string}%'`;
    try {
        return pool.query(query);
    } catch (error) {
        error.message = error.code;
        return error;
    }
}

// 6b - Get Provider By City
const getProvByCity = (string) => {
    const query = `SELECT * FROM prestadores WHERE ciudad LIKE '%${string}%'`;
    try {
        return pool.query(query);
    } catch (error) {
        error.message = error.code;
        return error;
    }
}

// 7 - Login Provider
const loginProv = (user) => {
    const query = `SELECT * FROM prestadores WHERE usuario = '${user}'`
    try {
        return pool.query(query)
    } catch (error) {
        error.message = error.code
        return error
    }
}

module.exports = { getAllProv, getProvById, addProv, editProvById, delProvById, getProvByName, getProvByCity, loginProv, agregarUnooo, registerProv }