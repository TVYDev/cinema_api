const request = require('supertest');
const mongoose = require('mongoose');
const Cinema = require('../../../models/Cinema');
let server;

describe('/api/v1/cinemas', () => {
    beforeAll(() => {
        server = require('../../../server');
    });
    afterAll(async () => {
        await server.close();
    });
    afterEach(async () => {
        await Cinema.deleteMany();
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
            const items = res.body.data.items;

            expect(res.status).toBe(200);

            expect(
                items.some((g) => g.name === 'Delee Cinma Phnom Penh')
            ).toBeTruthy();
            expect(
                items.some((g) => g.name === 'Delee Cinma Takmao')
            ).toBeTruthy();

            expect(
                items.some(
                    (g) => g.address === 'Toul Kork, Phnom Penh, Cambodia'
                )
            ).toBeTruthy();
            expect(
                items.some((g) => g.address === 'Takhmao, Cambodia')
            ).toBeTruthy();

            expect(
                items.some((g) => g.openingHours === '7AM - 10PM')
            ).toBeTruthy();
            expect(
                items.some((g) => g.openingHours === '8AM - 9PM')
            ).toBeTruthy();

            expect(items.length).toBe(2);
        });
    });

    describe('POST /', () => {
        const data = {
            name: 'Delee Cinma Phnom Penh',
            address: 'Toul Kork, Phnom Penh, Cambodia',
            openingHours: '7AM - 10PM'
        };

        const exec = () => request(server).post('/api/v1/cinemas');

        it('should return 400 if name is not provided', async () => {
            const curData = { ...data };
            delete curData.name;

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if name is more than 100 characters', async () => {
            const curData = { ...data };
            curData.name = new Array(102).join('a'); // this will generate a string of 'a' with 101 characters

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if address is not provided', async () => {
            const curData = { ...data };
            delete curData.address;

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if openingHours is not provided', async () => {
            
            delete data.openingHours;

            const res = await exec().send(data);

            expect(res.status).toBe(400);
        });

        it('should save the cinema if request body is valid', async () => {
            await exec().send(data);

            const cinema = await Cinema.find({
                name: 'Delee Cinma Phnom Penh'
            });

            expect(cinema).not.toBeNull();
        });

        it('should return cinema and status 200 if operation is successful', async () => {
            const res = await exec().send(data);

            console.log(res.body);

            expect(res.body.data).toHaveProperty('_id');
            expect(res.body.data).toHaveProperty(
                'name',
                'Delee Cinma Phnom Penh'
            );
            expect(res.body.data).toHaveProperty(
                'address',
                'Toul Kork, Phnom Penh, Cambodia'
            );
            expect(res.body.data).toHaveProperty('openingHours', '7AM - 10PM');
        });
    });
});
