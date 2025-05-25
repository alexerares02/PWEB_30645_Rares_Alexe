module.exports = (sequelize, DataTypes) => {
    const Course = sequelize.define("course", {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        domain: {
            type: DataTypes.STRING,
            allowNull: false
        },
        startdate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        enddate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        nrmeetings: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        cost: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        availablespots: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        availablelanguage: {
            type: DataTypes.JSON,
            allowNull: false
        },
        profID: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    })

    return Course
}