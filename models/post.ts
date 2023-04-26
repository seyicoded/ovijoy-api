'use strict';
const {
  Model: Model4
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model4 {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      (models.post).belongsTo(models.users);
      (models.post).belongsTo(models.category);
      (models.post).hasMany(models.likes);
      (models.post).hasMany(models.comments);
    }
  }
  Post.init({
    caption: DataTypes.TEXT,
    media: DataTypes.STRING,
    mediaType: DataTypes.STRING,
    hashtags: DataTypes.TEXT,
    country: DataTypes.STRING,
    status: DataTypes.INTEGER,
    views: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'post',
  });
  return Post;
};