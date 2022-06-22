module.exports = app => {
    const users = require('../controllers/pothole.controller');
    var router = require("express").Router();
    
    // Create a new User
    router.post("/", users.create);

    // Get all Users
    router.get("/", users.findAll);

    // Get a single user by id
    router.get("/:id", users.findOne);

    // Update a user by id
    router.put("/:id", users.update);

    // Delete a user by id
    router.delete("/:id", users.delete);

    // Delete all users
    router.delete("/", users.deleteAll);

    app.use("/api/v1/users", router);
}