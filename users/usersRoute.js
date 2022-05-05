/* Aquí pondremos la referencia a la ruta asociada, y si las hubiera, a las subrutas */
/* Por ejemplo podríamos recibir todas las peticiones de /users y también de /users/algomas */
/* Luego de recibir la petición diferenciando el verbo HTTP, enviaríamos al controlador apropiado */
/* Si hubiera middlewares, se aplicarían en este archivo, entre la petición y el controlador */

const{ listAll, listOne, register, login, forgot, reset, saveNewPass, editOne, delOne } = require("./usersControl")

const router = require("express").Router()

const { validatorCreateUser, validatorResetPassword } = require("../validators/users");

const fileUpload = require("../utils/handleStorage");

// Get all Users
router.get("/", listAll);

// Get User By Id
router.get("/:id", listOne);

// Register new user
router.post("/register", fileUpload.single("file"), validatorCreateUser, register);

// Login User
router.post("/login", validatorLoginUser, login);

// Forgot Pass
router.post("/forgot-password", forgot) // Desde el front entra el mail del usuario que olvidó la contraseña

// Create a send Magic Link
router.get("/reset/:token", reset) // Mostramor el formulario nueva contraseña

router.post("/reset/:token", validatorResetPassword, saveNewPass) // Recibimos y grabamos la nueva contraseña

// Patch
router.patch("/:id", editOne);

// Delete user by Id
router.delete("/:id", delOne);

module.exports = router