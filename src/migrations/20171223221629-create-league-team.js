

module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable('league_team', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
        },
        league_id: {
            type: Sequelize.INTEGER(15),
            allowNull: false,
        },
        team_id: {
            type: Sequelize.INTEGER(15),
            allowNull: false,
        },
        is_active: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        created_at: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        updated_at: {
            type: Sequelize.DATE,
            allowNull: false,
        },
    }),
    down: queryInterface => queryInterface.dropTable('league_team'),
};
