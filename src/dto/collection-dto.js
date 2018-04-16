const getLeagueDto = require('./get-dto');

/**
 * The League entity collection structure that
 * will be returned in the response.
 * @param {Object[]} leagues
 * @return {*}
 */
module.exports = (leagues) => {
    leagues.forEach((league, index) => {
        leagues[index] = getLeagueDto.map(league);
    });
    return leagues;
};
