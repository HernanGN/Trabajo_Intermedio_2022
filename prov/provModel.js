/* Aquí va el modelo de datos. Consultas a la Base de Datos. */

const res = require("express/lib/response")
const pool = require("../data/config")

const getAllProv = () => {
    const query = "SELECT * FROM prestadores"
    try {
        return pool.query(query)
    } catch (error) {
        error.message = error.code
        return error
    }    
}

const getProvById = (id) => {
    const query = `SELECT * FROM prestadores WHERE idprestador = ${id}`
    try {
        return pool.query(query)
    } catch (error) {
        error.message = error.code
        return error        
    }    
}

const addProv = (prov) => {
    const query = `INSERT INTO prestadores SET ?`
    try {
        return pool.query(query, prov)
    } catch (error) {
        error.message = error.code
        return error
    }        
}

const loginProv = (email) => {
    const query = `SELECT * FROM prestadores WHERE email = '${email}'`
    try {
        return pool.query(query)
    } catch (error) {
        error.message = error.code
        return error
    }
}

const editProvById = (id, prov) => {
    const query = `UPDATE prestadores SET ? WHERE idprestador = ${id}`;
    try {
        return pool.query(query, prov)
    } catch (error) {
        error.message = error.code
        return error
    }
}

const delProvById = (id) =>{
    const query = `DELETE FROM prestadores WHERE idprestador = ${id}`
    try {
        return pool.query(query, id)
    } catch (error) {
        error.message = error.code
        return error
    }
}

module.exports = { getAllProv, getProvById, addProv, loginProv, editProvById, delProvById }