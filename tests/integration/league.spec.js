require('dotenv').config();

const models          = require('../../src/models/index');
const server          = require('../../devServer');
const leagueMysqlRepo = require('../../src/repository/mysql/league-repository');
const chai            = require('chai');
const chaiHttp        = require('chai-http');
const should          = chai.should();
const assert          = chai.assert;

chai.use(chaiHttp);

describe('League', () => {
    before(() => {
        models.League.sync({force: true});
    });
    describe('POST /leagues', () => {
        it('should create a League record and return its link', done => {
            const leagueRecord = {
                name: "Champions League",
                description: "Lorem ipsum",
                startDate: "2018-12-25T02:51:10.000Z",
                endDate: "2018-07-04T20:56:30.000Z",
                isActive: 0
            };
            chai.request(server)
                .post('/leagues')
                .set('Authorization', process.env.TEST_TOKEN)
                .set('content-type', 'application/json')
                .send(leagueRecord)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.should.have.header('content-location');
                    leagueMysqlRepo
                        .getLeagueById({leagueId:1})
                        .then(league => {
                            league.should.be.an('object');
                            done();
                        });
                });
        });
    });
    describe('PUT /leagues/:id', () => {
        it('should replace a League record with a new one', done => {
            const leagueRecord = {
                name: "Premiere League",
                description: "Lorem ipsum",
                startDate: "2018-12-25T02:51:10.000Z",
                endDate: "2018-07-04T20:56:30.000Z",
                isActive: 0
            };
            chai.request(server)
                .put('/leagues/1')
                .set('Authorization', process.env.TEST_TOKEN)
                .set('content-type', 'application/json')
                .send(leagueRecord)
                .end((err, res) => {
                    res.should.have.status(204);
                    leagueMysqlRepo
                        .getLeagueById({leagueId:1})
                        .then(league => {
                            league.should.be.an('object');
                            assert.equal(league.name, 'Premiere League');
                            done();
                        });
                });
        });
    });
    describe('GET /leagues', () => {
        it('should return an array of League objects', done => {
            chai.request(server)
                .get('/leagues')
                .set('Authorization', process.env.TEST_TOKEN)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.should.have.length(1);
                    res.body[0].should.be.an('object');
                    done();
                });
        });
        it('should return an array of League objects with fields: name, telephone', done => {
            chai.request(server)
                .get('/leagues?fields=id,name,startDate,endDate')
                .set('Authorization', process.env.TEST_TOKEN)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body[0].should.be.an('object').that.has.all.keys('id', 'name', 'startDate', 'endDate');
                    done();
                });
        });
        it('should return 400 when the requested fields are wrong', done => {
            chai.request(server)
                .get('/leagues?fields=name,doesNotExist')
                .set('Authorization', process.env.TEST_TOKEN)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
    });
    describe('GET /leagues/:id', () => {
        it('should return a League object', done => {
            chai.request(server)
                .get('/leagues/1')
                .set('Authorization', process.env.TEST_TOKEN)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    done();
                });
        });
        it('should return a League object with fields: id, address.street, address.number', done => {
            chai.request(server)
                .get('/leagues/1?fields=id,name,startDate,endDate')
                .set('Authorization', process.env.TEST_TOKEN)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object').that.has.all.keys('id', 'name', 'startDate', 'endDate');
                    done();
                });
        });
        it('should return 400 when the requested fields are wrong', done => {
            chai.request(server)
                .get('/leagues/1?fields=name,doesNotExist')
                .set('Authorization', process.env.TEST_TOKEN)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
    });
    describe('DELETE /leagues/:id', () => {
        it('should delete a League record', done => {
            chai.request(server)
                .delete('/leagues/1')
                .set('Authorization', process.env.TEST_TOKEN)
                .end((err, res) => {
                    res.should.have.status(204);
                    leagueMysqlRepo
                        .getLeagueById({leagueId:1})
                        .then(league => {
                            assert.equal(league, null);
                            done();
                        });
                });
        });
    });
});
