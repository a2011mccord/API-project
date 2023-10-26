'use strict';

/* @type {import('sequelize-cli').Migration} */

const { Spot } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: '1852 Joy Lane',
        city: 'North Hollywood',
        state: 'California',
        country: 'United States',
        lat: 34.138058,
        lng: -118.287849,
        name: 'Joyous Spot',
        description: 'This home offers joy and sunshine.',
        price: 149.99
      },
      {
        ownerId: 1,
        address: '4903 Kooter Lane',
        city: 'Charlotte',
        state: 'North Carolina',
        country: 'United States',
        lat: 35.260445,
        lng: -80.774849,
        name: 'Second Spot',
        description: 'Fun place to ride skooters.',
        price: 100
      },
      {
        ownerId: 2,
        address: '3770 Plainfield Avenue',
        city: 'Liverpool',
        state: 'New York',
        country: 'United States',
        lat: 43.029617,
        lng: -76.296463,
        name: 'Third Spot',
        description: "It's not an empty field, but it is plain.",
        price: 119.49
      },
      {
        ownerId: 3,
        address: '4265 Golden Ridge Road',
        city: 'Champlain',
        state: 'New York',
        country: 'United States',
        lat: 44.964828,
        lng: -73.422142,
        name: 'Fourth Spot',
        description: 'Gorgeous view of the city',
        price: 249.99
      }
    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Joyous Spot', 'Second Spot', 'Third Spot', 'Fourth Spot'] }
    }, {});
  }
};
