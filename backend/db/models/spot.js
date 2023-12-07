'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'ownerId',
        as: 'Owner'
      }),
      this.hasMany(models.Booking, {
        foreignKey: 'spotId'
      }),
      this.hasMany(models.Review, {
        foreignKey: 'spotId'
      }),
      this.hasMany(models.SpotImage, {
        foreignKey: 'spotId'
      })
    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING(256),
      allowNull: false,
      unique: true
    },
    city: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    state: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    lat: {
      type: DataTypes.DECIMAL(8, 6),
      allowNull: false
    },
    lng: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [0, 50]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 1
      }
    }
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
