// References to the associated Routes and subroutes, also Controllers and Middlewares

const{ listAll, listOne, addOne, login, recovery, reset, saveNewPass, editOne, delOne } = require("./provControl")

const router = require("express").Router()

const { validatorCreateProv, validatorResetPassword } = require("../validators/prov");

const fileUpload = require("../utils/handleStorage");

// Get All Providers (Prestadores)
router.get("/", listAll);

// Get Provider By Id
router.get("/:id", listOne);

// Add a new Provider
//router.post("/add", fileUpload.single("imagen"), validatorCreateProv, addOne);
router.post("/add", addOne);

// Provider Login
router.post("/login", validatorLoginProv, login);

// Provider Password Recovery
router.post("/recovery", recovery)

// Create a Send Magic Link
router.get("/reset/:token", reset)

router.post("/reset/:token", validatorResetPassword, saveNewPass)

// Provider Edit
router.patch("/:id", editOne);

// Delete Provider by Id
router.delete("/:id", delOne);

module.exports = router