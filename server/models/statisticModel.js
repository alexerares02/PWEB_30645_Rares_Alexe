module.exports = (sequelize, DataTypes) => {
    const Statistic = sequelize.define("statistic", {
        courseID: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        month: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        year: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        nrstudents: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    return Statistic
}