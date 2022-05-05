const jwt = require("jsonwebtoken");

const key = process.env.jwt_secret;

// Creamos el Token, recibe el payload (user) y una medida de tiempo (time)
const tokenSign = async(prov, time) => {
    // return sign
    return jwt.sign(prov, key, {expiresIn: time})
}

// Verificar que el Token esté firmado por el backend y que no haya expirado
const tokenVerify = async (token) => {
    try {
        return jwt.verify(token, key)
    } catch (error) {
        return error
    }
}

module.exports = {tokenSign, tokenVerify}