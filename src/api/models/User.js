module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define('tbl_user', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        age: {
            type: DataTypes.INTEGER
        },
        address: {
            type: DataTypes.STRING,
        },
    })

    return User
}