module.exports = (sequelize, DataTypes) => {
    const Enrollment = sequelize.define("enrollment", {
        studentID: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        courseID: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    return Enrollment
}