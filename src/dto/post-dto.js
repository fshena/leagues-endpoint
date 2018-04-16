const objMapper = require('object-mapper');

/**
 * The League json structure needed for storing a new entry.
 * @param {Object} league
 * @return {*}
 */
module.exports = (league) => {
    const src = {
        'id': 'id',
        'name': 'name',
        'description': 'description',
        'startDate': 'start_date',
        'endDate': 'end_date',
        'isActive': 'is_active',
    };
    return objMapper(league, src);
};
