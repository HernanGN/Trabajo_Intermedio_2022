const { check, validationResult } = require("express-validator")

//const res = require("express/lib/response")

const validatorCreateUser = [
    check("name")
        .exists().withMessage("Name field is required")
        .trim()
        .notEmpty().withMessage("Name can't be spaces") // Redundante
        .isAlpha('es-ES', { ignore: ' ' }).withMessage("Only letters please")
        .isLength({ min:2, max: 90 }).withMessage("Character count: Min 2, Max 90"),
    check("username")
        .exists().withMessage("Username field is required")
        .trim()
        .isAlpha('es-ES', { ignore: ' ' }).withMessage("Only letters please")
        .isLength({ min:2, max: 90 }).withMessage("Character count: Min 2, Max 90"),
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

validatorLoginUser = [
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

module.exports = { validatorCreateUser, validatorLoginUser, validatorResetPassword }