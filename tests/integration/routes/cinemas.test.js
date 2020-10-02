const request = require('supertest');
// const mongoose = require('mongoose');
let server;

describe('/api/v1/cinemas', () => {
    beforeEach(() => {
        server = require('../../../server');
    });
    afterEach(async () => {
        await server.close();
    });

    describe('GET /', () => {
        it('should return all cinemas', async () => {
            const res = await request(server).get('/api/v1/cinemas');
            expect(res.status).toBe(200);
        });
    });
});
