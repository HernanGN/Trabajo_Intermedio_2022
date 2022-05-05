/* Aquí va la lógica que maneja el comportamiento de nuestra API cada vez que se recibe una request a través de las rutas*/

const { getAllUsers, getUserById, registerUser, loginUser, editUserById, delUserById } = require("./usersModel")

const notNumber = require("../utils/notNumber")

const { hashPassword, checkPassword} = require("../utils/handlePassword")

const { tokenSign, tokenVerify } = require("../utils/handleJWT")

const { matchedData } = require("express-validator");

const nodemailer = require("nodemailer")

const url = process.env.url_base

// Consultar Todos los Usuarios
const listAll = async(req, res, next) => {
    const dbResponse = await getAllUsers()
    //dbResponse.hasOwnProperty("error") ? res.status(500).json(dbResponse) : res.status(200).json(dbResponse)
    //dbResponse instanceof Error ? next(dbResponse) : res.status(200).json(dbResponse)
    if ( dbResponse instanceof Error ) return next(dbResponse);
    dbResponse.length ? res.status(200).json(dbResponse) : next()
}

// Consultar Un Usuario
const listOne = async(req, res, next) => {
    if(notNumber(req.params.id, res)) return
    const dbResponse = await getUserById(Number(req.params.id))
    //if (dbResponse.hasOwnProperty("error")) return res.status(500).json(dbResponse);
    if ( dbResponse instanceof Error ) return next(dbResponse);
    dbResponse.length ? res.status(200).json(dbResponse) : next()
}

// Agregar Un Usuario - Register New User
const register = async(req, res, next) => {
    const cleanBody = matchedData(req)   
    // Tenemos que capturar req.body.password y encriptarla antes de enviarla a la base de datos
    // vamos a invocar nuestra función hashPassword(password) => Recibe por parámetro req.body.password
    //console.log("Objeto req.body:", req.body)
    //console.log("Objeto req.file:", req.file)
    //console.log("Objeto req.file:", req.file.filename)
    //res.sendStatus(200)
    //const image = `${url}${req.file.filename}`
    const image = url + req.file.filename;
    //console.log(image)
    //const password = await hashPassword(req.body.password)
    const password = await hashPassword(cleanBody.password)
    //const dbResponse = await registerUser({...req.body, password, image})
    const dbResponse = await registerUser({...cleanBody, password, image})
    //dbResponse instanceof Error ? next(dbResponse) : res.status(201).json(`User ${req.body.name} created`)
    if (dbResponse instanceof Error) return next(dbResponse);
    const user = {
        //name: req.body.name,
        name: cleanBody.name,
        //email: req.body.email
        email: cleanBody.email
    }
    const tokenData = {
        token: await tokenSign(user, '2h'),
        user 
    };
    //res.status(201).json({user: req.body.name, Token_Info: tokenData});
    res.status(201).json({user: cleanBody.name, Token_Info: tokenData});
};

//Login User
const login = async(req, res, next) => {
    //console.log("Request:", req.body)
    const cleanBody = matchedData(req)
    //console.log("Filtered:", cleanBody)
    //const dbResponse = await loginUser(req.body.email)
    const dbResponse = await loginUser(cleanBody.email)
    //console.log(dbResponse)
    if (dbResponse.length <= 0) {
        return next();
    } else {
        //console.log(req.body.password)
        //console.log(dbResponse[0].password)
        //console.log(await checkPassword(req.body.password, dbResponse[0].password))
        //if (await checkPassword(req.body.password, dbResponse[0].password)){
        if (await checkPassword(cleanBody.password, dbResponse[0].password)){
            //res.sendStatus(200)
            //res.status(200).json({message: "Ok, puede ingresar"})
            const user = {
                id: dbResponse[0].id,
                name: dbResponse[0].name,
                email: dbResponse[0].email,
                image: dbResponse[0].image
            };
            const tokenData = {
                token: await tokenSign(user, '2h'),
                user
            };
            res.status(200).json({message: `User ${user.name} logged in!`, Token_info: tokenData})
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
const forgot = async (req, res, next) => {
    //console.log("Req", req.body)
    //console.log("Mail", req.body.email)
    const dbResponse = await loginUser(req.body.email)
    //console.log("Respuesta", dbResponse)
    if (dbResponse.length <= 0) {
        return next();
    } else {
        const user = {
            id: dbResponse[0].id,
            name: dbResponse[0].name,
            email: dbResponse[0].email
        }
        const token = await tokenSign(user, "3h")// "15m")
        const link = `${process.env.url_base}users/reset/${token}`
        //console.log(link)
        //res.status(200).json({ link })
        const mailDetails = {
            from: "tech-support@mydomain.com",
            to: user.email,
            subject: "Password recovery",
            html:
            `<h2>Pass Recovery Center</h2>
            <p>Bla Bla Bla</p>
            <a href ="${link}">Click to recover your password</a>`
        }
        transport.sendMail(mailDetails, (err, data) => {
            if (err) return next(err);
            //console.log(data)
            res.status(200).json({message: `Hi ${user.name}, we've sent an email to ${user.email}. You've 15 minutes to reset your password` })
        })
    }
}


// Mostramos el formulario - Reset Pass (Get)
const reset = async (req, res, next) => {
    //res.send("Llegamos al Link")
    //console.log(req.params)
    //console.log(req.params.token)
    const { token } = req.params
    const tokenStatus = await tokenVerify(req.params.token)
    //console.log(tokenStatus)
    if (tokenStatus instanceof Error) {
        res.status(403).json({ message: "Invalidad or expired token" })
    } else {
        res.render("reset", { token, tokenStatus })
    }
    //res.render("reset")
 }

// Respuesta al formulario - Reset Pass (Post)
const saveNewPass = async (req, res, next) => { 
    //console.log("Está Ok para guardar la nueva contraseña")
    //console.log(req.body)
    const { token } = req.params
    const tokenStatus = await tokenVerify( token )
    if (tokenStatus instanceof Error) return next(tokenStatus);
    const newPassword = await hashPassword(req.body.password_1)
    const dbResponse = await editUserById(tokenStatus.id, { password: newPassword })
    dbResponse instanceof Error? next(dbResponse): res.status(200).json({ message: `Password changed for user ${tokenStatus.name}`})

}

// Modificar Un Usuario
const editOne = async(req, res, next) => {
    if(notNumber(req.params.id, res)) return
    const dbResponse = await editUserById(+req.params.id, req.body)
    //if ( dbResponse.hasOwnProperty("error") ) return res.status(500).json(dbResponse);
    if ( dbResponse instanceof Error ) return next(dbResponse);
    dbResponse.affectedRows ? res.status(200).json(req.body) : next()
}

// Eliminar Un Usuario
const delOne = async(req, res, next) => {
    if(notNumber(req.params.id, res)) return
    const dbResponse = await delUserById(+req.params.id)
    //if (dbResponse.hasOwnProperty("error")) return res.status(500).json(dbResponse);
    if ( dbResponse instanceof Error ) return next(dbResponse);
    dbResponse.affectedRows ? res.status(204).end() : next()
}

module.exports = { listAll, listOne, register, login, forgot, reset, saveNewPass, editOne, delOne }