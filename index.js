const leagues = require('./src/handler/league-handler');
const validator = require('../../src/middleware/validator-middleware');
const getLeagueDto = require('./src/dto/get-dto');

module.exports = (server) => {
    server.get(
        {path: '/leagues', name: 'getLeagues'},
        validator.query,
        validator.fields(getLeagueDto),
        leagues.get
    );
    server.get(
        {path: '/leagues/:id([0-9]+)', name: 'getLeaguesById'},
        validator.query,
        validator.fields(getLeagueDto),
        leagues.getById
    );
    server.post(
        {path: '/leagues', name: 'postLeagues'},
        leagues.post
    );
    server.put(
        {path: '/leagues/:id([0-9]+)', name: 'putLeagues'},
        leagues.put
    );
    server.patch(
        {path: '/leagues/:id([0-9]+)', name: 'patchLeagues'},
        leagues.patch
    );
    server.del(
        {path: '/leagues/:id([0-9]+)', name: 'deleteLeagues'},
        leagues.delete
    );
};
