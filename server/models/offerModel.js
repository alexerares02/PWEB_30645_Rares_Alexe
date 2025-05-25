module.exports = (sequelize, DataTypes) => {
    const Offer = sequelize.define("offer", {
        courseID: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        discount: {
            type: DataTypes.FLOAT,
            allowNull: false
        }
    });
    return Offer
}