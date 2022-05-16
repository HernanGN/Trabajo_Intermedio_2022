const pool = require("../data/config")

// 1a - Get All the Authortizations
const getAllAuth = () => {
    const query = "SELECT * FROM autorizaciones"
    try {
        return pool.query(query);
    } catch (error) {
        error.message = error.code;
        return error;
    }
};

// 1b - Get Authortizations By Provider
const getAuthByProv = (prov) => {
    const query = `SELECT * FROM autorizaciones WHERE idprestador = ${prov}`;
    try {
        return pool.query(query);
    } catch (error) {
        error.message = error.code;
        return error;
    }
}

// 1b - Get Authortizations By Affiliate
const getAuthByAffi = (affi) => {
    const query = `SELECT * FROM autorizaciones WHERE nroafiliado = ${affi}`;
    try {
        return pool.query(query);
    } catch (error) {
        error.message = error.code;
        return error;
    }
}

// 1d - Get Authortizations By Date
const getAuthByDate = (date) => {
    const query = `SELECT * FROM autorizaciones WHERE fecha = '${date}'`;
    try {
        return pool.query(query);
    } catch (error) {
        error.message = error.code;
        return error;
    }
}

// 2 - Add New Authorization
const addNewAuth = (auth) => {
    const query = "INSERT INTO autorizaciones SET ?"
    try {
        return pool.query(query, auth);        
    } catch (error) {
        error.message = error.code;
        return error;
    }
}

module.exports = { getAllAuth, getAuthByProv, getAuthByAffi, getAuthByDate, addNewAuth }