'use strict';
const {
  Model: Model21
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class collection extends Model21 {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      (models.collection).hasMany(models.bookmark);
    }
  }
  collection.init({
    title: DataTypes.STRING,
    status: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'collection',
  });
  return collection;
};