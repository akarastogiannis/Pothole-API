require('dotenv').config()

const db = require('../models');
const User = db.users;
const Op = db.sequelize.Op;

// JsonWebTokens
const jwt = require('jsonwebtoken');

// Nodemailer
const nodemailer = require("nodemailer");

exports.verifyUser = (req, res) =>  {

    // Validate the req
    if(!req.body) {
        res.status(400).send({
            message: "Content cannot be empty!"
        });
        return;
    }

    // Check to see if the user is verified or not
    const id = req.params.id;
    User.findByPk(id)
        .then(data => {
            if(data) {
                // Found the user
                // Check if users isVerified is true or not
                if(data.isVerified === false) {
                    // User is NOT verified, Proceded to Verify the User

                    // create a random 6 digit verification code
                    const verificationCode = Math.floor(100000 + Math.random() * 900000)

                    // Save the 6 digit verfication code to their database
                    User.update({ verifyCode: verificationCode }, {
                        where: { id: id }
                    })
                        .then(num => {
                            if(num == 1) {
                                // The 6 digit vefication code is Successfully Saved to their database

                                // email the user the verification code
                                let transporter = nodemailer.createTransport({
                                    service: "",
                                    auth: {
                                        user: "",
                                        pass: ""
                                    }
                                });

                                console.log("Message sent: %s", info.messageId);
                                




                                // check to see if the codes match, if yes turn isVerified to true and set verification code to null,
                                
                                res.status(200).send(data);
                            } else {
                                // The 6 digit vefication code Failed to Save
                                res.status(400).send({
                                    message: `Cannot update User verifyCode with id: ${id}. Maybe User was not found or req.body is empty!`
                                });
                            }
                        })
                        .catch(err => {
                            // Some Error happened trying to Save the 6 didgit verifyCode to the Users Database
                            res.status(500).send({
                                message: "Error updating User verifyCode with id: " + id
                            });
                        });
                } else {
                    // User is verified, don't procede
                    res.status(403).send({
                        message: `User with id: ${id} email is already verified, no longer needs to be verified!`
                    });
                }
            } else {
                // Can't find the User by Id
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
}