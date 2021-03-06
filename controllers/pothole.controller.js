require('dotenv').config()

const db = require('../models');
const User = db.users;
const Op = db.sequelize.Op;

// Bcrypt
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Nodemailer
const nodemailer = require("nodemailer");

//Create and Save a new User
exports.create = (req, res) =>  {

    // Validate the req
    if(!req.body) {
        res.status(400).send({
            message: "Content cannot be empty!"
        });
        return;
    }

    // Hash the password and create the user
    bcrypt.hash(req.body.pwd, saltRounds, function(err, hash) {
        // Store hash in your password DB.

        const hashedPwd = hash;

        // Create the User
        const user = {
            fName: req.body.fName,
            lName: req.body.lName,
            username: req.body.username,
            email: req.body.email,
            hashedPwd: hashedPwd,
            dob: req.body.dob,
            verifyCode: req.body.verifyCode,
            isVerified: req.body.isVerified
        }

        // Verify Email Service
        // var transporter = nodemailer.createTransport({
        //     service: 'yahoo',
        //     auth: {
        //         user: 'potholeapi@yahoo.com',
        //         pass: '!V!nMVE6RP?zHShHpAEw"5:G7w~E2nt'
        //     }
        // });

        // const verifyCode = 12345;

        // var mailOptions = {
        //     from: 'potholeapi@yahoo.com',
        //     to: req.body.email,
        //     subject: 'PotHole API Verify Email',
        //     text: 'Verification  code ' + verifyCode
        // };

        // transporter.sendMail(mailOptions, function(error, info){
        //     if (error) {
        //       console.log(error);
        //     } else {
        //       console.log('Email sent: ' + info.response);
        //     }
        // }); 

        // Save the User into the Database
        User.create(user)
            .then(data => {
                res.status(201).send(data);
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occured while creating the User."
                });
            });

    });
};

exports.login = async (req, res) => {
     // Validate the req
     if(!req.body) {
        res.status(400).send({
            message: "Content cannot be empty!"
        });
        return;
    }

    const username = req.body.username;
    const pwd = req.body.pwd;

    // User.findOne({ where: { username: username, hashedPwd: pwd}})
    //     .then(data => {
    //         res.status(200).send(data);
    //     })
    //     .catch(err => {
    //         res.status(500).send({
    //             message: err.message || "Some error while getting all Users."
    //         });
    //     });

    // I should rename potentialUser to User
    const potentialUser = await User.findOne({ where: { username: username}})
    if(potentialUser == null) {
        // Username does not exist
        res.status(404).send({
            message: `User with Username: ${username} Does Not Exist.`
        });
    } else {
        // Username does exist

        // Get Registerd User hashedPwd from database to verify Potential User is Registered User
        const hashedPwd = potentialUser.hashedPwd;

        // Check pwd with hashedPwd
        bcrypt.compare(pwd, hashedPwd, function(err, result) {
            // result == true
            if(result == true) {
                // User checks out, welcome the user
                res.status(200).send({
                    message: `User with Username: ${username} & Password Exists.`
                });
            } else if(result == false) {
                // User does not check out 
                res.status(401).send({
                    message: `User with Username: ${username} Exists But Password is Wrong!`
                });
            } else {
                // Some type of Error
                res.status(401).send({
                    message: `User with Username: ${username} Exists But some type of Error occured with Password, Maybe Password is Missing!`
                });
            }
        });
    }

    // const potentialUser = await User.findOne({ where: { username: username, hashedPwd: hashedPwd}})

    // if(potentialUser == null) {
        // res.status(404).send({
        //     message: `User with Username: ${username} Does Not Exist.`
        // });
    // } else {
    //     res.status(200).send({
    //         message: `User with Username: ${username} Exists.`
    //     });
    // }
};

//Retrieve all Users from the database
exports.findAll = (req, res) => {
    const username = req.body.username;
    var condition = username ? { username: { [Op.like]: `%${username}%` } } : null;
    User.findAll({ where: condition })
        .then(data => {
            res.status(200).send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error while getting all Users."
            });
        });
};

//Find a Single User by the Id
exports.findOne = (req, res) => {
    const id = req.params.id;
    User.findByPk(id)
        .then(data => {
            if (data) {
                res.status(200).send(data);
            } else {
                res.status(400).send({
                    message: `Cannot find the User with id: ${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error while getting User id: " + id
            });
        });
};

//Update a User by the Id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    User.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.status(200).send({
                    message: "User was updated successfully."
                });
            } else {
                res.status(400).send({
                    message: `Cannot update User with id: ${id}. Maybe User was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating User with id: " + id
            });
        });
};

//Delete a User by the id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    User.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "User was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete User with id: ${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete User with id: " + id
            });
        });
};

//Delete all Users from the database
exports.deleteAll = (req, res) => {
    User.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Users were deleted successfully!`});
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occured while deleting all Users."
            });
        });
};

