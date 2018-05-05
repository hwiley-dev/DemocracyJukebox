module.exports = function(sequelize, DataTypes){
    var User = sequelize.define("User", {
        id : {
            type: DataTypes.INTEGER, 
            autoIncrement: true,
            primaryKey: true
        },
        name : {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len:[2]
            }
        }
    })
    return User
}