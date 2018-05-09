
module.exports = function (sequelize, DataTypes) {
  var Playlist = sequelize.define('Playlist', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    song_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2]
      }
    },
    video_link: {
      type: DataTypes.STRING
    },
    song_length: {
      type: DataTypes.STRING
    },
    votes: {
      type: DataTypes.INTEGER
    },
    video_id: {
      type: DataTypes.STRING
    },
    thumbnail_url: {
      type: DataTypes.STRING
    }

  })
  return Playlist
}
