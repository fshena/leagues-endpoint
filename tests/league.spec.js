require('dotenv').config();

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/server');
const models = require('../src/model/index');
const should = chai.should();

chai.use(chaiHttp);

const leagueRecord = {
    name: "Champions League",
    description: "Lorem ipsum",
    start_date: "2018-12-25T02:51:10.000Z",
    end_date: "2018-07-04T20:56:30.000Z",
    is_active: 0
};

describe('League', () => {
    beforeEach(async () => {
        await models.League.sync({force: true});
        models.League.create(leagueRecord);
    });

    describe('GET /leagues', () => {
        it('it should return an array of League objects', done => {
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

        it('it should return an array of League objects with fields: name, telephone', done => {
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

        it('it should return 400 when the requested fields are wrong', done => {
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
        it('it should return a League object', done => {
            chai.request(server)
                .get('/leagues/1')
                .set('Authorization', process.env.TEST_TOKEN)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    done();
                });
        });

        it('it should return a League object with fields: id, address.street, address.number', done => {
            chai.request(server)
                .get('/leagues/1?fields=id,name,startDate,endDate')
                .set('Authorization', process.env.TEST_TOKEN)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object').that.has.all.keys('id', 'name', 'startDate', 'endDate');
                    done();
                });
        });

        it('it should return 400 when the requested fields are wrong', done => {
            chai.request(server)
                .get('/leagues/1?fields=name,doesNotExist')
                .set('Authorization', process.env.TEST_TOKEN)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
    });

    describe('POST /leagues', () => {
        it('it should create a League record and return its link', done => {
            const leagueRecord = {
                "name": "UEFA",
                "description": "Best league in the world",
                "startDate": "2017-11-30",
                "endDate": "2017-12-28"
            };
            chai.request(server)
                .post('/leagues')
                .set('Authorization', process.env.TEST_TOKEN)
                .set('content-type', 'application/json')
                .send(leagueRecord)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.should.have.header('content-location');
                    done();
                });
        });
    });

    describe('PUT /leagues/:id', () => {
        it('it should replace a League record with a new one', done => {
            const leagueRecord = {
                "name": "Champions League",
                "description": "Best league in the world",
                "startDate": "2018-11-30",
                "endDate": "2017-12-28"
            };
            chai.request(server)
                .put('/leagues/1')
                .set('Authorization', process.env.TEST_TOKEN)
                .set('content-type', 'application/json')
                .send(leagueRecord)
                .end((err, res) => {
                    res.should.have.status(204);
                    done();
                });
        });
    });

    describe('PATCH /leagues/:id', () => {
        it('it should update a League record field value', done => {
            const patch =  {
                "op": "update",
                "path": "endDate",
                "value": "2017-12-28"
            };
            chai.request(server)
                .patch('/leagues/1')
                .set('Authorization', process.env.TEST_TOKEN)
                .send(patch)
                .end((err, res) => {
                    res.should.have.status(204);
                    done();
                });
        });
    });

    describe('DELETE /leagues/:id', () => {
        it('it should delete a League record', done => {
            chai.request(server)
                .delete('/leagues/1')
                .set('Authorization', process.env.TEST_TOKEN)
                .end((err, res) => {
                    res.should.have.status(204);
                    done();
                });
        });
    });
});
