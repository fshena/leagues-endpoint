const { db }          = require('@localleague/database');
const leagueModel     = require('./league-model');
const leagueTeamModel = require('./league_team-model');

const models = [
    leagueModel,
    leagueTeamModel,
];

module.exports = db.loadModels(models);
