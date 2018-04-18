const queryMiddleware   = require('../middleware/query-middleware');
const fieldsMiddleware  = require('../middleware/fields-middleware');
const leaguesController = require('../controllers/league-controller');

module.exports = (server) => {
    server.get(
        { path: '/leagues', name: 'getLeagues' },
        queryMiddleware,
        fieldsMiddleware,
        leaguesController.get
    );
    server.get(
        { path: '/leagues/:id([0-9]+)', name: 'getLeaguesById' },
        queryMiddleware,
        fieldsMiddleware,
        leaguesController.getById
    );
    server.post(
        { path: '/leagues', name: 'postLeagues' },
        leaguesController.post
    );
    server.put(
        { path: '/leagues/:id([0-9]+)', name: 'putLeagues' },
        leaguesController.put
    );
    server.del(
        { path: '/leagues/:id([0-9]+)', name: 'deleteLeagues' },
        leaguesController.delete
    );
    server.get(
        { path: '/leagues/swagger.json', name: 'docsLeagues' },
        leaguesController.docs
    );
};
