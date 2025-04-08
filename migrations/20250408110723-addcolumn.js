'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn("user", "is_agree_location", {
      type : Sequelize.BOOLEAN,
      defaultValue : false
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.removeColumn("user", "is_agree_location");
  }
};
