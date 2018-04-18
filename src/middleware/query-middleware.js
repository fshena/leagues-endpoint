const Errors     = require('restify-errors');
const Joi        = require('joi');
const httpStatus = require('http-status-codes');

/**
 * If the query params do not conform to the params schema
 * then throw an error, otherwise continue.
 * @param {Object} req
 * @param {Object} res
 * @param {function} next
 * @return {*}
 */
module.exports = (req, res, next) => {
    if (Object.keys(req.query).length === 0) {
        return next();
    }
    const querySchema = Joi.object().keys({
        limit: Joi.number().integer().max(100),
        offset: Joi.number().integer(),
        fields: Joi.string().regex(/^[a-zA-Z.]+(?:,[a-zA-Z.]+)*$/),
        order: Joi.string().valid('ASC', 'DESC', 'asc', 'desc'),
        sort: Joi.string(),
    });
    const validation = Joi.validate(req.query, querySchema);
    if (validation.error !== null) {
        return next(new Errors.BadRequestError({
            code: httpStatus.BAD_REQUEST,
            message: validation.error.details[0].message,
        }));
    }
    return next();
};
