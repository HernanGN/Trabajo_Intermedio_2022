//const { tokenSign } = require("../utils/handleJWT");

const { addNewPost, getPostsWith, getAllPosts } = require("./autoModel");

const listAll = async(req, res, next) => {
    //console.log("Router listar todos los Posts")
    //console.log(req.query);
    let dbResponse = null;
    if(req.query.title) {
        dbResponse = await getPostsWith(req.query.title);
    } else {
        dbResponse = await getAllPosts();
    }
    if (dbResponse instanceof Error) return next(dbResponse);
    dbResponse.length ? res.status(200).json(dbResponse) : next()
};

const addOne = async(req, res, next) => {
    //console.log("Router listar todos los Posts")
    const dbResponse = await addNewPost({ userid: req.token.id, ...req.body });
    dbResponse instanceof Error ? next(dbResponse) : res.status(201).json({message: `Post created by ${req.token.name}`})
};

module.exports = { listAll, addOne }