module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        fName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        lName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        username: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            isEmail: true,
            unique: true
        },
        hashedPwd: {
            type: Sequelize.STRING,
            allowNull: false
        },
        dob: {
            type: Sequelize.DATE,
            isDate: true,
            allowNull: false
        }
    });
    return User;
  };