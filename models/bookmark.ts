'use strict';
const {
  Model: Model23
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class bookmark extends Model23 {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      (models.bookmark).belongsTo(models.post);
    }
  }
  bookmark.init({
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'bookmark',
  });
  return bookmark;
};