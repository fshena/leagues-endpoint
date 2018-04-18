const { paginationLinks }     = require('@localleague/helpers');
const httpStatus              = require('http-status-codes');
const yaml                    = require('yamljs');

const leagueMySqlRepository   = require('../repository/mysql/league-repository');
const errorController         = require('./error-controller');
const getLeagueDto            = require('../dto/get-dto');
const postLeagueDto           = require('../dto/post-dto');
const putLeagueDto            = require('../dto/put-dto');
const leagueCollectionDto     = require('../dto/collection-dto');
const { query: { maxLimit } } = require('../config/api-config');

/**
 * Query database for using user id.
 * @param {Object} req
 * @param {Object} res
 * @param {function} next
 */
exports.getById = (req, res, next) => {
    const sendResponse = (league) => {
        const status = league ? httpStatus.OK : httpStatus.NOT_FOUND;
        res.status(status);
        if (status === httpStatus.NOT_FOUND) {
            return res.json();
        }
        return res.json(getLeagueDto.map(league));
    };
    leagueMySqlRepository
        .getLeagueById({ leagueId: req.params.id, fields: req.params.fields })
        .then(sendResponse)
        .catch(errors => errorController(errors, next));
};

/**
 * Get all user form the database.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {function} next
 */
exports.get = (req, res, next) => {
    const sendResponse = (league) => {
        res.set({
            Link: paginationLinks(req, league.count, maxLimit),
            'X-Total-Count': league.count,
        });
        res.status(httpStatus.OK);
        res.json(leagueCollectionDto(league.rows));
    };
    leagueMySqlRepository
        .getAllLeagues(req)
        .then(sendResponse)
        .catch(errors => errorController(errors, next));
};

/**
 * Save users in the database.
 * @param {Object} req
 * @param {Object} res
 * @param {function} next
 */
exports.post = (req, res, next) => {
    const sendResponse = (league, created) => {
        const createdLeague = league.get({ plain: true });
        let status = httpStatus.CREATED;
        // If no new user was created because it already exists.
        if (!created && createdLeague) {
            status = httpStatus.NOT_MODIFIED;
        }
        // The link where to find the new user or the existing one.
        res.header('Content-Location', `${req.route.path}/${createdLeague.id}`);
        res.status(status);
        res.json(getLeagueDto.map(createdLeague));
    };
    leagueMySqlRepository
        .createLeague(postLeagueDto(req.body))
        .spread(sendResponse)
        .catch(errors => errorController(errors, next));
};

/**
 * Update users data.
 * @param {Object} req
 * @param {Object} res
 * @param {function} next
 */
exports.put = (req, res, next) => {
    const sendResponse = (updated) => {
        const status = updated[0] > 0
            ? httpStatus.NO_CONTENT
            : httpStatus.NOT_FOUND;
        res.status(status);
        res.json();
    };
    leagueMySqlRepository
        .updateLeague(req.params.id, putLeagueDto(req.body))
        .then(sendResponse)
        .catch(errors => errorController(errors, next));
};

/**
 * Delete user from the database.
 * @param {Object} req
 * @param {Object} res
 * @param {function} next
 */
exports.delete = (req, res, next) => {
    const sendResponse = (deleted) => {
        // Send different status if record for deletion exists or not.
        const status = deleted ? httpStatus.NO_CONTENT : httpStatus.NOT_FOUND;
        res.status(status);
        res.json();
    };
    leagueMySqlRepository
        .deleteLeague(req.params.id)
        .then(sendResponse)
        .catch(errors => errorController(errors, next));
};

/**
 * Send a json representation of the swagger file.
 * @param {Object} req
 * @param {Object} res
 */
exports.docs = (req, res) => {
    const nativeObj = yaml.load(`${__dirname}/../../docs/swagger.yaml`);
    res.json(nativeObj);
};
