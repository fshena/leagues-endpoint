const { object: objHelper } = require('@localleague/helpers');
const Errors                = require('restify-errors');
const httpStatus            = require('http-status-codes');
const getLeagueDto          = require('../dto/get-dto');

/**
 * Validate if the requested model fields can be returned in the response.
 * @param {Object} req
 * @param {Object} res
 * @param {function} next
 * @return {*}
 */
module.exports = (req, res, next) => {
    if (!req.query.fields) {
        return next();
    }
    // reverse db fields <=> response object mapping and get its attributes
    const modelFields = Object.keys(objHelper.reverse(getLeagueDto.getMap()));
    // check if any of the requested fields is not included in the model.
    const validFields = req.query.fields.split(',').every(field => modelFields.includes(field));
    let errorMessage = null;
    if (!validFields) {
        errorMessage = 'Requested field not available';
    }
    // check if the sort field is valid.
    const validSortField = modelFields.includes(req.query.sort);
    if (typeof req.query.sort !== 'undefined' && !validSortField) {
        errorMessage = 'Provided sort field not available';
    }
    if (errorMessage !== null) {
        return next(new Errors.BadRequestError({
            code: httpStatus.BAD_REQUEST,
            message: errorMessage,
        }));
    }
    return next();
};
