/* global define, it, describe, beforeEach, document */
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../server/app');

const { fakeAuthor, createAuthorInDB, nonExistentObjectId } = require('../lib/fake');

const expect = chai.expect;
chai.use(chaiHttp);

describe('/api/authors', function () {
    this.timeout(6500);

    it('GET / should respond with authors', (done) => {
        chai.request(app)
            .get('/api/authors')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.instanceOf(Array);
                done();
            });
    });

    it('GET /:id should respond with a author when a valid ID is passed', (done) => {
        createAuthorInDB().then(author => {
            chai.request(app)
                .get(`/api/authors/${author.id}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.instanceOf(Object);
                    expect(res.body.id).to.equal(author.id);
                    done();
                });
        });
    });

    it('GET /:id should respond with 404 when an invalid ID is passed', (done) => {
        chai.request(app)
            .get(`/api/authors/${nonExistentObjectId}`)
            .end((err, res) => {
                expect(res).to.have.status(404);
                done();
            });
    });

    it('POST / should save a new author to the database', (done) => {
        chai.request(app)
            .post('/api/authors')
            .send(fakeAuthor)
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.not.be.null;
                expect(res.body.id).to.exist;

                const savedAuthorId = res.body.id;

                chai.request(app)
                    .get(`/api/authors/${res.body.id}`)
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(err).to.be.null;
                        expect(res.body.id).to.exist;
                        expect(res.body.id).to.equal(savedAuthorId)

                        done();
                    });
            });
    });

    it('PUT /:id should update a author', (done) => {
        createAuthorInDB().then(author => {
            chai.request(app)
                .put(`/api/authors/${author.id}`)
                .send({ firstName: 'Jane', lastName: 'Doe' })
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(204);
                    
                    chai.request(app)
                        .get(`/api/authors/${author.id}`)
                        .end((err, res) => {
                            expect(err).to.be.null;
                            expect(res).to.have.status(200);
                            expect(res.body.id).to.equal(author.id);
                            expect(res.firstName).to.not.equal('John');
                            expect(res.lastName).to.not.equal('Smith');
                            done();
                        });
                });
        });
    });

    it('DELETE /:id should delete a author', (done) => {
        createAuthorInDB().then(author => {
            chai.request(app)
                .delete(`/api/authors/${author.id}`)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);

                    chai.request(app)
                        .get(`/api/authors/${author.id}`)
                        .end((err, res) => {
                            expect(res).to.have.status(404);
                            done();
                        })
                });
        })
    });
});