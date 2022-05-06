const router = require("express").Router()

const {listAll, addOne} = require("./autoControl");

const isAuth = require("../middlewares/isAuth");

router.get("/", listAll);

router.post("/", isAuth, addOne);

module.exports = router;