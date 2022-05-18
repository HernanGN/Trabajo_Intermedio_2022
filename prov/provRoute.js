// References to the associated Routes and subroutes, also Controllers and Middlewares

const{ listAll, listOne, addOne, login, recovery, reset, saveNewPass, editOne, delOne } = require("./provControl")

const router = require("express").Router()

const { validatorCreateProv, validatorResetPassword } = require("../validators/prov");

const fileUpload = require("../utils/handleStorage");

// 1 - Get All Providers (Prestadores)
router.get("/", listAll);

// 2 - Get Provider By Id
router.get("/:id", listOne);

// 3 - Add a new Provider
router.post("/add", fileUpload.single("imagen"), validatorCreateProv, addOne);

// Agregar = Luego Borrar Este Código
router.post("/", agregarUno);

// 4 - Provider Edit
router.patch("/:id", editOne);

// 5 - Delete Provider by Id
router.delete("/:id", delOne);

// 6 - Search Provider
// router.get("/", listAll);

// 7 - Provider Login
router.post("/login", validatorLoginProv, login);

// 8a - Provider Password Recovery
router.post("/recovery", recovery)

// 8b - Reset Pass - Create a Send Magic Link
router.get("/reset/:token", reset)

// 8c - Reset Password
router.post("/reset/:token", validatorResetPassword, saveNewPass)

module.exports = router