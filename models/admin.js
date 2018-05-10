module.exports = function (sequelize, DataTypes) {
  var Admin = sequelize.define('Admin', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {type: DataTypes.STRING},
    password: {type:DataTypes.STRING}
  })  
  return Admin
}


