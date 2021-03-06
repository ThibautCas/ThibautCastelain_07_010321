'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Comment.belongsTo(models.User, {
        foreignKey: 'Id',
        onDelete: 'CASCADE'
      });
      Comment.belongsTo(models.Post, {
        foreignKey: 'Id',
        onDelete: 'CASCADE'
      })
    }
  };
  Comment.init({
    userId: DataTypes.STRING,
    postId: DataTypes.STRING,
    dateTime: DataTypes.DATE,
    text: DataTypes.TEXT,
    image: DataTypes.STRING,
    likes: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};