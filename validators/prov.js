const { check, validationResult } = require("express-validator")

const validatorCreateProv = [
    check("nombre")
        .exists().withMessage("El campo Nombre es obligatorio.")
        .trim()
        .isAlpha('es-ES', { ignore: ' ' }).withMessage("Solo letras en el Nombre por favor.")
        .isLength({ min:10, max: 100 }).withMessage("Largo mínimo de Nombre 10 caracteres, máximo 100."),
    check("usuario")
        .exists().withMessage("El campo Usuario es obligatorio.")
        .trim()
        .isLength({ min:6, max: 20 }).withMessage("Largo mínimo de Usuario 6 caracteres, máximo 20."),
    check("domicilio")
        .exists().withMessage("El campo Domicilio es obligatorio.")
        .trim()
        .isLength({ min:10, max: 50 }).withMessage("Largo mínimo de Domicilio 10 caracteres, máximo 50."),
    check("ciudad")
        .exists().withMessage("El campo Ciudad es obligatorio.")
        .trim()
        .isLength({ min:10, max: 50 }).withMessage("Largo mínimo de Ciudad 10 caracteres, máximo 50."),
    check("telefono")
        .exists().withMessage("El campo Teléfono es obligatorio.")
        .trim()
        .isLength({ min:5, max: 25 }).withMessage("Largo mínimo de Teléfono 5 caracteres, máximo 25."),
    check("correo")
        .trim()
        .isEmail().withMessage("Por favor verifique el campo Correo.")
        .normalizeEmail(),
    check("clave")
        .exists().withMessage("El campo Clave es requerido.")
        .trim()
        .isLength({ min: 8, max: 15 }).withMessage("La Clave debe tener un largo mínimo 8 caracteres y máximo de 15."),
    (req, res, next) => {
        // Errors Check
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errores: errors.array() })
        } else {
            next()
        }
    }        
]

validatorLoginProv = [
    check("email")
        .exists().withMessage("Email field is required")
        .trim()
        .isEmail().withMessage("Must be a valid Email address")
        .normalizeEmail(),
    check("password")
        .exists().withMessage("Password field is required")
        .trim()
        .isLength({ min: 8 }).withMessage("Character count: Min 8"),
    (req, res, next) => {
        // Averiguamos si hay errores de validación y los envolvemos en un objeto que tiene varias funciones útiles
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errores: errors.array() })
        } else {
            next()
        }
    }        
]

const validatorResetPassword = [
    check("password_1")
        .exists().withMessage("Password field is required")
        .trim()
        .isLength({ min: 8, max: 15 }).withMessage("Character count: Min 8 Max 15"),    
    check("password_2")
        .custom(async(password_2, { req }) => {
            if (req.body.password_1 !== password_2) {
                throw new Error("Both pass must be identical")
            }
        }),
    (req, res, next) => {
        const { token } = req.params
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            const arrWarnings = errors.array()
            console.log(arrWarnings)
            res.render("reset", {arrWarnings, token})
        } else {
            return next();
        }
    }
]

module.exports = { validatorCreateProv, validatorLoginProv, validatorResetPassword }