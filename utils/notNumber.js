const notNumber = (id, res) => {
    if (isNaN(Number(id))){
        res.status(400).json({ message: "Id must be a positive integer" })
        return true
    } else {
        return false
    }
}

module.exports = notNumber;