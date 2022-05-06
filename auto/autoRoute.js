const router = require("express").Router()

const {listAll, addOne} = require("./postsControl");

const isAuth = require("../middlewares/isAuth");

router.get("/", listAll);

router.post("/", isAuth, addOne);

module.exports = router;