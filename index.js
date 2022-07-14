require("dotenv").config()

require("./data/config")

const cors = require("cors");

const PORT = process.env.PORT

const express = require("express")

const path = require("path")

const hbs = require("express-handlebars")

const server = express()

server.use(cors());

// Bootstrap file access via static routes
server.use("/css", express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")))
server.use("/js", express.static(path.join(__dirname, "node_modules/bootstrap/dist/js")))

// SetUp Handlebars
server.set("view engine", "hbs");
server.set("views", path.join(__dirname, "views")) // ./views
server.engine("hbs", hbs.engine({ extname: "hbs" }))

server.use(express.json())
server.use(express.urlencoded({ extended: true}))

server.use(express.static('storage'))

server.get("/", (req, res) => {
    const content = `
    <h1>API Servicio Médico de la Caja de Abogados</h1>
    <h2><a href="https://documenter.getpostman.com/view/18107569/UyxnDPxR"
           target="_blank">Consulte Nuestra Documentación para Utilizarla</a></h2>
    `
    res.send(content)
})

// Router for /prov endpoint (Prestadores = Providers)
server.use("/prov", require("./prov/provRoute"))

// Router for /auth endpoint (Autorizaciones = Authorizations)
server.use("/auth", require("./auth/authRoute"))

// Catch All Route
server.use((req, res, next) =>{
    let error = new Error
    error.status = 404
    error.message = "Resource not found"
    next(error)
});

//Error Handler
server.use((error, req, res, next) => {
    if (!error.status) {
        error.status = 500;
        error.message = "Internal Server Error"
    } else {
    res.status(error.status).json({ status: error.status, message: error.message })
    }
})

server.listen(PORT, (err) => {
    err ? console.log(`Error: ${err}`) : console.log(`App corre en puerto:${PORT}`)
});