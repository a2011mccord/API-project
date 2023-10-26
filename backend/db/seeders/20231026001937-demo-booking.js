'use strict';

/* @type {import('sequelize-cli').Migration} */

const { Booking } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Booking.bulkCreate([
      {
        spotId: 1,
        userId: 2,
        startDate: Date.UTC(2023, 10, 1),
        endDate: Date.UTC(2023, 10, 3)
      },
      {
        spotId: 2,
        userId: 3,
        startDate: Date.UTC(2023, 10, 15),
        endDate: Date.UTC(2023, 10, 20)
      },
      {
        spotId: 3,
        userId: 1,
        startDate: Date.UTC(2023, 11, 5),
        endDate: Date.UTC(2023, 11, 6)
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
