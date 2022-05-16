const bcrypt = require("bcrypt");

const saltRounds = 10;

const hashPassword = async(password) => {
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    return hashedPassword
    //return await bcrypt.hash(password, saltRounds)
}

const checkPassword = async(originalPassword, hashedPassword) => {
    const passwordMatch = await bcrypt.compare(originalPassword, hashedPassword)
    return passwordMatch
}

module.exports = { hashPassword, checkPassword }