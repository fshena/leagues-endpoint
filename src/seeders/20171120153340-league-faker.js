

const faker = require('faker');

module.exports = {
    up: (queryInterface) => {
        const leagues = [];
        for (let i = 0; i < 100; i++) {
            leagues.push({
                name: faker.lorem.words(),
                description: faker.lorem.sentences(),
                start_date: faker.date.future(),
                end_date: faker.date.future(),
                created_at: faker.date.past(),
                updated_at: faker.date.past(),
            });
        }

        return queryInterface.bulkInsert('league', leagues, {});
    },

    down: queryInterface => queryInterface.bulkDelete('league', null, {}),
};
