// Handling the Behavior of our API each time a request is received through the routes

const { getAllProv, getProvById, addProv, editProvById, delProvById, getProvByName, getProvByCity, loginProv, agregarUnooo, registerProv } = require("./provModel")

const notNumber = require("../utils/notNumber")

const { hashPassword, checkPassword} = require("../utils/handlePassword")

const { tokenSign, tokenVerify } = require("../utils/handleJWT")

const { matchedData } = require("express-validator");

const nodemailer = require("nodemailer")

const url = process.env.url_base

// 1 - Read All or Search Providers (Prestadores)
const listAll = async(req, res, next) => {
    let dbResponse = null;
    if(req.query.nombre) {
        dbResponse = await getProvByName(req.query.nombre);
    } else {
        if(req.query.ciudad) {
            dbResponse = await getProvByCity(req.query.ciudad);
        } else {        
            dbResponse = await getAllProv();
        }
    }
    if ( dbResponse instanceof Error ) return next(dbResponse);
    dbResponse.length ? res.status(200).json(dbResponse) : next()
}

// 2 - Read One Provider
const listOne = async(req, res, next) => {
    if(notNumber(req.params.id, res)) return
    const dbResponse = await getProvById(Number(req.params.id))
    if ( dbResponse instanceof Error ) return next(dbResponse);
    dbResponse.length ? res.status(200).json(dbResponse) : next()
}

// 3 - Add New Provider
const addOne = async(req, res, next) => {
    const cleanBody = matchedData(req)   
    const image = url + req.file.filename;
    const password = await hashPassword(cleanBody.clave)
    const dbResponse = await addProv({...cleanBody, imagen: image, clave: password})
    if (dbResponse instanceof Error) return next(dbResponse);
    const prov = {
        usuario:   cleanBody.usuario,
        nombre:    cleanBody.nombre,
        correo:    cleanBody.correo,
    }
    const tokenData = {
        token: await tokenSign(prov, '2h'),
        prov 
    };
    res.status(201).json({prov: cleanBody.usuario, Token_Info: tokenData});
};

// Prueba Agregar Uno - Luego Borrar este Código
const agregarUno = async(req, res, next) => {
    console.log("agregarUno req", req.body)
    const { usuario, nombre} = req.body
    if(!usuario || !nombre || usuario === "" || nombre === "") {
        let error = new Error ("All fields required")
        error.status = 400
        next(error)
    } else {
        const dbResponse = await agregarUnooo(req.body)
        dbResponse.hasOwnProperty("error") ? res.status(500).json(dbResponse) : res.status(201).json(req.body)

    }
}

// Agregar Un Prestador - Luego Borrar Este Código
const register = async(req, res, next) => {
    // Tenemos que capturar req.body.password y encriptarla antes de enviarla a la baed de datos
    // vamos a invocar nuestra función hashPassword(password) => Recibe por parámetro req.body.password
    //const resultado = await hashPassword(req.body.password)
    //console.log("Contraseña original:", req.body.password)
    //console.log("Contraseña encriptada", resultado)
    const clave = await hashPassword(req.body.clave)
    const dbResponse = await registerProv({...req.body, clave})
    dbResponse instanceof Error ? next(dbResponse) : res.status(201).json(`Prov ${req.body.usuario} created`)
}

// 4 - Provider Edit
const editOne = async(req, res, next) => {
    if(notNumber(req.params.id, res)) return
    const dbResponse = await editProvById(+req.params.id, req.body)
    if ( dbResponse instanceof Error ) return next(dbResponse);
    dbResponse.affectedRows ? res.status(200).json(req.body) : next()
}

// 5 - Provider Delete
const delOne = async(req, res, next) => {
    if(notNumber(req.params.id, res)) return
    const dbResponse = await delProvById(+req.params.id)
    if ( dbResponse instanceof Error ) return next(dbResponse);
    dbResponse.affectedRows ? res.status(204).end() : next()
}

// 6 - Provider Search
// listAll Reuse

// 7 - Provider Login
const login = async(req, res, next) => {
    const cleanBody = matchedData(req)
    const dbResponse = await loginProv(cleanBody.usuario)
    if (dbResponse.length <= 0) {
        return next();
    } else {
        if (await checkPassword(cleanBody.clave, dbResponse[0].clave)){
            const prov = {
                idprestador: dbResponse[0].idprestador,
                usuario:     dbResponse[0].usuario,
                nombre:      dbResponse[0].nombre,
                correo:      dbResponse[0].correo
            };
            const tokenData = {
                token: await tokenSign(prov, '2h'),
                prov
            };
            res.status(200).json({message: `Prov ${prov.usuario} logged in!`, Token_info: tokenData})
        } else {
            let error = new Error
            error.status = 401
            error.message = "unauthorized"
            next(error)
        }
    }
}

// 8_ - Configurar nodemailer
const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.usermail,
      pass: process.env.userpass
    }
  });

// 8a - Password Recovery
const recovery = async (req, res, next) => {
    const dbResponse = await loginProv(req.body.usuario)
    if (dbResponse.length <= 0) {
        return next();
    } else {
        const prov = {
            idprestador: dbResponse[0].idprestador,
            nombre:      dbResponse[0].nombre,
            domicilio:   dbResponse[0].domicilio,
            ciudad:      dbResponse[0].ciudad,
            telefono:    dbResponse[0].telefono,
            correo:      dbResponse[0].correo,
            imagen:      dbResponse[0].imagen
        }
        const token = await tokenSign(prov, "3h")// "15m")
        const link = `${process.env.url_base}prov/reset/${token}`
        const mailDetails = {
            from: "soporte@serviciomedico.com",
            to: prov.correo,
            subject: "Password Recovery",
            html:
            `<h2>Centro de Recuperación de Contraseña</h2>
            <p>Servicio Médico de la Caja de Abogados</p>
            <a href ="${link}">Click para Recuperar Su Contraseña</a>`
        }
        transport.sendMail(mailDetails, (err, data) => {
            if (err) return next(err);
            res.status(200).json({message: `Hola ${prov.nombre}, enviamos un correo a ${prov.correo}. Ud. tiene 15 minutos para restablecer su contraseña` })
        })
    }
}

// 8b - Reset Password Form (Get)
const reset = async (req, res, next) => {
    const { token } = req.params
    const tokenStatus = await tokenVerify(req.params.token)
    if (tokenStatus instanceof Error) {
        res.status(403).json({ message: "Token no válido o vencido" })
    } else {
        res.render("reset", { token, tokenStatus })
    }
 }

// 8c - Response to the Reset Pass Form (Post)
const saveNewPass = async (req, res, next) => {
    const { token } = req.params
    const tokenStatus = await tokenVerify( token )
    if (tokenStatus instanceof Error) return next(tokenStatus);
    const newPassword = await hashPassword(req.body.password_1)
    const dbResponse = await editProvById(tokenStatus.idprestador, { clave: newPassword })
    dbResponse instanceof Error? next(dbResponse): res.status(200).json({ message: `Clave actualizada para el Prestador ${tokenStatus.nombre}`})
}

// 9 - Medical Benefit Authorization


module.exports = { listAll, listOne, addOne, editOne, delOne, login, recovery, reset, saveNewPass, agregarUno, register }