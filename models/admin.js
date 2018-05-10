module.exports = function (sequelize, DataTypes) {
  var Admin = sequelize.define('Admin', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2]
      }
    },
    password: {type:DataTypes.STRING}
  })
  return Admin
}


