const Op = require('sequelize').Op;

const models = require('../../model/index');
const apiConfig = require('../../../../src/config/api-config');
const objHelper = require('../../../../src/helper/object-helper');
const getLeagueDto = require('../../dto/get-dto');

/**
 * Get specific league entry.
 * @param {Object} req
 * @return {Promise<Array<Model>>}
 */
exports.getLeagueById = (req) => {
    let sqlQuery = {
        where: {
            [Op.and]: {
                id: req.params.id,
            },
        },
        raw: true,
    };
    if (req.params.fields) {
        sqlQuery.attributes = objHelper.getDbFieldsNames(
            getLeagueDto.getMap(),
            req.params.fields.split(',')
        );
    }
    return models.League.findOne(sqlQuery);
};

/**
 * Get all leagues.
 * @param {Object} req
 * @return {Promise<Array<Model>>}
 */
exports.getAllLeagues = (req) => {
    let limit = parseInt(req.query.limit) || apiConfig.query.maxLimit;
    let sqlQuery = {
        limit: limit,
        offset: parseInt(req.query.offset) * limit || 0,
        order: [
            [
                req.query.sort || models.League.attributes.name,
                req.query.order || 'ASC',
            ],
        ],
        raw: true,
    };
    if (req.params.fields) {
        sqlQuery.attributes = objHelper.getDbFieldsNames(
            getLeagueDto.getMap(),
            req.params.fields.split(',')
        );
    }
    return models.League.findAndCountAll(sqlQuery);
};

/**
 * Create new league entry if the league doesn't already exist.
 * @param {Object} newLeague
 * @return {Promise<Model, created>}
 */
exports.createLeague = (newLeague) => {
    // TODO: Change League identifier
    const conditions = {
        where: {
            [Op.and]: {
                name: newLeague.name,
            },
        },
        defaults: newLeague,
    };
    return models.League.findOrCreate(conditions);
};

/**
 * Update league entry.
 * @param {integer} id
 * @param {Object} newLeague
 * @return {Promise}
 */
exports.updateLeague = (id, newLeague) => {
    const conditions = {
        where: {
            [Op.and]: {
                id: id,
            },
        },
    };
    return models.League.update(newLeague, conditions);
};

/**
 * Delete specific league entry.
 * @param  {integer} id
 * @return {Promise}
 */
exports.deleteLeague = (id) => {
    const conditions = {
        where: {
            [Op.and]: {
                id: id,
            },
        },
    };
    return models.League.destroy(conditions);
};

/**
 * Update specific fields of a league entry.
 * @param {integer} id
 * @param {Object} data
 * @return {Promise}
 */
exports.patchLeague = (id, data) => {
    let attributes = {};
    attributes[data.path] = data.value;
    const conditions = {
        where: {
            [Op.and]: {
                id: id,
            },
        },
    };
    return models.League.update(attributes, conditions);
};
