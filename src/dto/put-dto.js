const objMapper = require('object-mapper');

/**
 * The League json structure needed for updating an entry.
 * @param {Object} league
 * @return {*}
 */
module.exports = (league) => {
    const src = {
        name: 'name',
        description: 'description',
        startDate: 'start_date',
        endDate: 'end_date',
        isActive: 'is_active',
    };
    return objMapper(league, src);
};
