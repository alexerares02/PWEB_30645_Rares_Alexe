module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("user", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {//student or professor
            type: DataTypes.STRING,
            allowNull: false
        },
        language: {
            type: DataTypes.JSON,
            allowNull: false
        },
    });

    return User
}