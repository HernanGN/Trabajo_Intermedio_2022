const pool = require("../data/config")

const getPostsWith = (string) => {
    const query = `SELECT * FROM posts WHERE title LIKE '%${string}%'`;
    try {
        return pool.query(query);
    } catch (error) {
        error.message = error.code;
        return error;
    }
}

const getAllPosts = () => {
    const query = "SELECT * FROM posts"
    try {
        return pool.query(query);
    } catch (error) {
        error.message = error.code;
        return error;
    }
};

const addNewPost = (post) => {
    const query = "INSERT INTO posts SET ?"
    try {
        return pool.query(query, post);
    } catch (error) {
        error.message = error.code;
        return error;
    }
}

module.exports = { getPostsWith, getAllPosts, addNewPost }