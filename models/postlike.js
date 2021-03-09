'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PostLike extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PostLike.belongsTo(models.User, {
        foreignKey: 'Id',
        onDelete: 'CASCADE'
      });
      PostLike.belongsTo(models.Post, {
        foreignKey: 'Id',
        onDelete: 'CASCADE'
      })

    }
  };
  PostLike.init({
    userId: DataTypes.INTEGER,
    postId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PostLike',
  });
  return PostLike;
};