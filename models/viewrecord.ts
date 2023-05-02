'use strict';
const {
  Model: Model26
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class viewrecord extends Model26 {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      (models.viewrecord).belongsTo(models.users);
      (models.viewrecord).belongsTo(models.post);
      (models.viewrecord).belongsTo(models.status);
      (models.viewrecord).belongsTo(models.giveaway);
    }
  }
  viewrecord.init({
    
  }, {
    sequelize,
    modelName: 'viewrecord',
  });
  return viewrecord;
};