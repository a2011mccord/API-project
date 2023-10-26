'use strict';

/* @type {import('sequelize-cli').Migration} */

const { Review } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Review.bulkCreate([
      {
        spotId: 1,
        userId: 3,
        review: 'As joyous as the listing claimed',
        stars: 4
      },
      {
        spotId: 4,
        userId: 1,
        review: 'Wonderful home with amazing views',
        stars: 5
      },
      {
        spotId: 3,
        userId: 1,
        review: 'Very plain home',
        stars: 3
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 4, 3] }
    }, {});
  }
};
