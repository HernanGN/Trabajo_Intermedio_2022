// Handling the Behavior of our API each time a request is received through the routes

const { getAllProv, getProvById, addProv, loginProv, editProvById, delProvById } = require("./provModel")

const notNumber = require("../utils/notNumber")

const { hashPassword, checkPassword} = require("../utils/handlePassword")

const { tokenSign, tokenVerify } = require("../utils/handleJWT")

const { matchedData } = require("express-validator");

const nodemailer = require("nodemailer")

const url = process.env.url_base

// Read All the Providers (Prestadores)
const listAll = async(req, res, next) => {
    const dbResponse = await getAllProv()
    if ( dbResponse instanceof Error ) return next(dbResponse);
    dbResponse.length ? res.status(200).json(dbResponse) : next()
}

// Read One Provider
const listOne = async(req, res, next) => {
    if(notNumber(req.params.id, res)) return
    const dbResponse = await getProvById(Number(req.params.id))
    if ( dbResponse instanceof Error ) return next(dbResponse);
    dbResponse.length ? res.status(200).json(dbResponse) : next()
}

// Add New Provider
const addOne = async(req, res, next) => {
    const cleanBody = matchedData(req)   
    const image = url + req.file.filename;
    const password = await hashPassword(cleanBody.password)
    const dbResponse = await addProv({...cleanBody, password, image})
    if (dbResponse instanceof Error) return next(dbResponse);
    const prov = {
        nombre:    cleanBody.nombre,
        domicilio: cleanBody.domicilio,
        ciudad:    cleanBody.ciudad,
        telefono:  cleanBody.telefono,
        correo:    cleanBody.correo,
    }
    const tokenData = {
        token: await tokenSign(prov, '2h'),
        prov 
    };
    res.status(201).json({prov: cleanBody.nombre, Token_Info: tokenData});
};

// Provider Login
const login = async(req, res, next) => {
    const cleanBody = matchedData(req)
    const dbResponse = await loginProv(cleanBody.email)
    if (dbResponse.length <= 0) {
        return next();
    } else {
        if (await checkPassword(cleanBody.clave, dbResponse[0].clave)){
            const prov = {
                idprestador: dbResponse[0].idprestador,
                nombre:      dbResponse[0].nombre,
                domicilio:   dbResponse[0].domicilio,
                ciudad:      dbResponse[0].ciudad,
                telefono:    dbResponse[0].telefono,
                correo:      dbResponse[0].email,
                imagen:      dbResponse[0].imagen
            };
            const tokenData = {
                token: await tokenSign(prov, '2h'),
                prov
            };
            res.status(200).json({message: `Prov ${prov.nombre} logged in!`, Token_info: tokenData})
        } else {
            let error = new Error
            error.status = 401
            error.message = "unauthorized"
            next(error)
        }
    }
}

// Configurar nodemailer
const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.usermail,
      pass: process.env.userpass
    }
  });

// Forgot Pass
const recovery = async (req, res, next) => {
    const dbResponse = await loginProv(req.body.email)
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
            to: prov.email,
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


// Reset Password Form (Get)
const reset = async (req, res, next) => {
    const { token } = req.params
    const tokenStatus = await tokenVerify(req.params.token)
    if (tokenStatus instanceof Error) {
        res.status(403).json({ message: "Token no válido o vencido" })
    } else {
        res.render("reset", { token, tokenStatus })
    }
 }

// Response to the Reset Pass Form (Post)
const saveNewPass = async (req, res, next) => { 
    const { token } = req.params
    const tokenStatus = await tokenVerify( token )
    if (tokenStatus instanceof Error) return next(tokenStatus);
    const newPassword = await hashPassword(req.body.password_1)
    const dbResponse = await editProvById(tokenStatus.id, { password: newPassword })
    dbResponse instanceof Error? next(dbResponse): res.status(200).json({ message: `Clave actualizada para el Prestador ${tokenStatus.name}`})
}

// Provider Edit
const editOne = async(req, res, next) => {
    if(notNumber(req.params.id, res)) return
    const dbResponse = await editProvById(+req.params.id, req.body)
    if ( dbResponse instanceof Error ) return next(dbResponse);
    dbResponse.affectedRows ? res.status(200).json(req.body) : next()
}

// Provider Delete
const delOne = async(req, res, next) => {
    if(notNumber(req.params.id, res)) return
    const dbResponse = await delProvById(+req.params.id)
    if ( dbResponse instanceof Error ) return next(dbResponse);
    dbResponse.affectedRows ? res.status(204).end() : next()
}

module.exports = { listAll, listOne, addOne, login, recovery, reset, saveNewPass, editOne, delOne }