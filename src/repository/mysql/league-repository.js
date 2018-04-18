const { object: objHelper }   = require('@localleague/helpers');
const { Op }                  = require('sequelize');
const { query: { maxLimit } } = require('../../config/api-config');
const models                  = require('../../models');
const getLeagueDto            = require('../../dto/get-dto');

/**
 * Get specific league entry.
 * @param {{leagueId: numeric, fields: array}} payload
 * @return {Promise<Model>}
 */
exports.getLeagueById = (payload) => {
    const sqlQuery = {
        where: {
            [Op.and]: {
                id: payload.leagueId,
            },
        },
        raw: true,
    };
    if (payload.fields) {
        sqlQuery.attributes = objHelper.getDbFieldsNames(
            getLeagueDto.getMap(),
            payload.fields.split(',')
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
    const limit = parseInt(req.query.limit, 10) || maxLimit;
    const sqlQuery = {
        limit,
        offset: parseInt(req.query.offset, 10) * limit || 0,
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
                id,
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
                id,
            },
        },
    };
    return models.League.destroy(conditions);
};
