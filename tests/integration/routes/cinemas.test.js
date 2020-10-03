const request = require('supertest');
const mongoose = require('mongoose');
const Cinema = require('../../../models/Cinema');
let server;

describe('/api/v1/cinemas', () => {
    beforeEach(() => {
        server = require('../../../server');
    });
    afterEach(async () => {
        await Cinema.deleteMany();
        await server.close();
    });

    describe('GET /', () => {
        it('should return all cinemas', async () => {
            await Cinema.create([
                {
                    name: 'Delee Cinma Phnom Penh',
                    address: 'Toul Kork, Phnom Penh, Cambodia',
                    openingHours: '7AM - 10PM'
                },
                {
                    name: 'Delee Cinma Takmao',
                    address: 'Takhmao, Cambodia',
                    openingHours: '8AM - 9PM'
                }
            ]);

            const res = await request(server).get('/api/v1/cinemas');
            expect(res.status).toBe(200);
        });
    });
});
