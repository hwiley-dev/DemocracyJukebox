// this file makes an admin table

var Admin = sequelize.define('admin', {
  username: Sequelize.STRING,
  password: Sequelize.STRING
})
