const getLeagueDto = require('./get-dto');

/**
 * The League entity collection structure that
 * will be returned in the response.
 * @param {Object[]} leagues
 * @return {*}
 */
module.exports = (leagues) => {
    const leaguesDto = leagues;
    leaguesDto.forEach((league, index) => {
        leaguesDto[index] = getLeagueDto.map(league);
    });
    return leaguesDto;
};
