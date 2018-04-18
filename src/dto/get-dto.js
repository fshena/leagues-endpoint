const { object: objHelper } = require('@localleague/helpers');
const objMapper             = require('object-mapper');
const extract               = require('extract');

const mapping = {
    id: 'id',
    name: 'name',
    description: 'description',
    start_date: 'startDate',
    end_date: 'endDate',
    is_active: 'isActive',
};

module.exports = {
    getMap: () => mapping,
    /**
     * the user entity structure that will be returned in the response.
     * @param {Object} league
     * @param {boolean} reverse
     * @return {*}
     */
    map: (league, reverse = false) => {
        const invert = reverse;
        // only map requested fields in order to avoid empty nested fields
        const mapFields = extract(mapping, Object.keys(league));
        const src = invert ? objHelper.reverse(mapFields) : mapFields;
        return objMapper(league, src);
    },
};
