const HttpStatus = require('http-status-codes');

const leagueMySqlRepository = require('../repository/mysql/league-repository');
const paginationLinks = require('../../../src/helper/pagination_links-helper');
const errorHandler = require('../../../src/handler/error-handler');

const getLeagueDto = require('../dto/get-dto');
const postLeagueDto = require('../dto/post-dto');
const putLeagueDto = require('../dto/put-dto');
const leagueCollectionDto = require('../dto/collection-dto');

/**
 * Query database for using user id.
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 */
exports.getById = (req, res, next) => {
    const sendResponse = (league) => {
        const status = league ? HttpStatus.OK : HttpStatus.NOT_FOUND;
        res.status(status);
        if (status === HttpStatus.NOT_FOUND) {
            return res.json();
        }
        res.json(getLeagueDto.map(league));
    };
    leagueMySqlRepository
        .getLeagueById(req)
        .then(sendResponse);
};

/**
 * Get all user form the database.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 */
exports.get = (req, res, next) => {
    const sendResponse = (league) => {
        res.set({
            'Link': paginationLinks.paginationLinks(req, league.count),
            'X-Total-Count': league.count,
        });
        res.status(HttpStatus.OK);
        res.json(leagueCollectionDto(league.rows));
    };
    leagueMySqlRepository
        .getAllLeagues(req)
        .then(sendResponse);
};

/**
 * Save users in the database.
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 */
exports.post = (req, res, next) => {
    const sendResponse = (league, created) => {
        const createdLeague = league.get({plain: true});
        let status = HttpStatus.CREATED;
        // If no new user was created because it already exists.
        if (!created && createdLeague) {
            status = HttpStatus.NOT_MODIFIED;
        }
        // The link where to find the new user or the existing one.
        res.header('Content-Location', req.route.path + '/' + createdLeague.id);
        res.status(status);
        res.json(getLeagueDto.map(createdLeague));
    };
    leagueMySqlRepository
        .createLeague(postLeagueDto(req.body))
        .spread(sendResponse)
        .catch((errors) => errorHandler.model(errors, next));
};

/**
 * Update users data.
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 */
exports.put = (req, res, next) => {
    const sendResponse = (updated) => {
        let status = updated[0] > 0
            ? HttpStatus.NO_CONTENT
            : HttpStatus.NOT_FOUND;
        res.status(status);
        res.json();
    };
    leagueMySqlRepository
        .updateLeague(req.params.id, putLeagueDto(req.body))
        .then(sendResponse)
        .catch((errors) => errorHandler.model(errors, next));
};

/**
 * Delete user from the database.
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 */
exports.delete = (req, res, next) => {
    const sendResponse = (deleted) => {
        // Send different status if record for deletion exists or not.
        let status = deleted ? HttpStatus.NO_CONTENT : HttpStatus.NOT_FOUND;
        res.status(status);
        res.json();
    };
    leagueMySqlRepository
        .deleteLeague(req.params.id)
        .then(sendResponse);
};

/**
 * Update specific user fields.
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 */
exports.patch = (req, res, next) => {
    // Find user with the specific id.
    const sendResponse = (updated) => {
        let status = updated ? HttpStatus.NO_CONTENT : HttpStatus.NOT_FOUND;
        res.status(status);
        res.json();
    };
    leagueMySqlRepository
        .patchLeague(req.params.id, req.body)
        .then(sendResponse);
};
