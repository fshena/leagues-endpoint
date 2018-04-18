
module.exports = (sequelize, DataTypes) => {
    const leagueTeam = sequelize.define('LeagueTeam', {
        league_id: {
            type: DataTypes.INTEGER(15),
            allowNull: false,
        },
        team_id: {
            type: DataTypes.INTEGER(15),
            allowNull: false,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    }, {
        freezeTableName: true,
        tableName: 'league_team',
        underscored: true,
    });
    return leagueTeam;
};
