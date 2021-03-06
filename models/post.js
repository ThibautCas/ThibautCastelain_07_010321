'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Post.belongsTo(models.User, {
        foreignKey: 'Id',
        onDelete: 'CASCADE'
      })
    }
  };
  Post.init({
    userId: DataTypes.STRING,
    dateTime: DataTypes.DATE,
    title: DataTypes.STRING,
    text: DataTypes.TEXT,
    image: DataTypes.STRING,
    likes: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};