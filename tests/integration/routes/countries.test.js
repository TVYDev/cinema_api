const request = require('supertest');
const mongoose = require('mongoose');
const { Country } = require('../../../models/Country');
let server;

describe('Countries', () => {
    beforeAll(() => {
        server = require('../../../server');
    });
    afterAll(async () => {
        await server.close();
    });
    afterEach(async () => {
        await Country.deleteMany();
    });

    describe('POST /api/v1/countries', () => {
        const data = {
            name: 'Cambodia',
            code: 'kh'
        };

        const exec = () => request(server).post('/api/v1/countries');

        it('should return 400 if name is not provided', async () => {
            const curData = { ...data };
            delete curData.name;

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if name is not a string', async () => {
            const curData = { ...data };
            curData.name = true;

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if name is an empty string', async () => {
            const curData = { ...data };
            curData.name = '';

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if name is more than 100 characters', async () => {
            const curData = { ...data };
            curData.name = new Array(102).join('a');

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if name is duplicated', async () => {
            const curData = { ...data };
            curData.code = '11';
            const res1 = await exec().send(curData);
            curData.code = '22';
            const res2 = await exec().send(curData);

            expect(res1.status).toBe(201);
            expect(res2.status).toBe(400);
        });

        it('should return 400 if code is not provided', async () => {
            const curData = { ...data };
            delete curData.code;

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if code is not a string', async () => {
            const curData = { ...data };
            curData.code = true;

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if code is an empty string', async () => {
            const curData = { ...data };
            curData.code = '';

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if code is more than 2 characters', async () => {
            const curData = { ...data };
            curData.code = 'aaa';

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if code is duplicated', async () => {
            const curData = { ...data };
            curData.name = 'one';
            const res1 = await exec().send(curData);
            curData.name = 'two';
            const res2 = await exec().send(curData);

            expect(res1.status).toBe(201);
            expect(res2.status).toBe(400);
        });

        it('should return 201, and create the country if request is valid', async () => {
            const res = await exec().send(data);

            const countryInDb = await Country.find({ name: 'Cambodia' });

            expect(res.status).toBe(201);
            expect(countryInDb).not.toBeNull();
        });

        it('should return 201, and return the created country if request is valid', async () => {
            const res = await exec().send(data);

            expect(res.status).toBe(201);
            expect(res.body.data).toHaveProperty('_id');
            expect(res.body.data).toHaveProperty('name', 'Cambodia');
            expect(res.body.data).toHaveProperty('code', 'KH');
            expect(res.body.data).toHaveProperty('createdAt');
        });
    });
});
