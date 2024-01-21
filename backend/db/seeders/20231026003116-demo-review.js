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
        review: 'As joyous as the listing claimed. Lorem ipsum dolor sit amet consectetur adipisicing elit. Id quia ducimus perferendis quis eveniet! Dolorem culpa, nulla maxime ullam illo dignissimos! Ducimus ea odit rem consequatur deserunt, ipsa sunt dolore perferendis, exercitationem dolores similique facere, ullam soluta autem officiis et adipisci temporibus! Veniam amet repudiandae perferendis quidem debitis rem tenetur.',
        stars: 4
      },
      {
        spotId: 4,
        userId: 1,
        review: 'Wonderful home with amazing views. Lorem ipsum dolor sit amet consectetur adipisicing elit. Id quia ducimus perferendis quis eveniet! Dolorem culpa, nulla maxime ullam illo dignissimos! Ducimus ea odit rem consequatur deserunt, ipsa sunt dolore perferendis, exercitationem dolores similique facere, ullam soluta autem officiis et adipisci temporibus! Veniam amet repudiandae perferendis quidem debitis rem tenetur.',
        stars: 5
      },
      {
        spotId: 3,
        userId: 1,
        review: 'Very plain home. Lorem ipsum dolor sit amet consectetur adipisicing elit. Id quia ducimus perferendis quis eveniet! Dolorem culpa, nulla maxime ullam illo dignissimos! Ducimus ea odit rem consequatur deserunt, ipsa sunt dolore perferendis, exercitationem dolores similique facere, ullam soluta autem officiis et adipisci temporibus! Veniam amet repudiandae perferendis quidem debitis rem tenetur.',
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
