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

    describe('GET /api/v1/countries', () => {
        it('should return 200, return all the countries if request is valid', async () => {
            await Country.create([
                {
                    name: 'Cambodia',
                    code: 'KH'
                },
                {
                    name: 'Japan',
                    code: 'JP'
                }
            ]);

            const res = await request(server).get('/api/v1/countries');
            const { items } = res.body.data;

            expect(res.status).toBe(200);
            expect(items.some((c) => c.name === 'Cambodia')).toBeTruthy();
            expect(items.some((c) => c.name === 'Japan')).toBeTruthy();
            expect(items.some((c) => c.code === 'KH')).toBeTruthy();
            expect(items.some((c) => c.code === 'JP')).toBeTruthy();
            expect(items).toHaveLength(2);
        });
    });

    describe('GET /api/v1/countries/:id', () => {
        let country;
        let countryId;

        beforeEach(async () => {
            country = await Country.create({
                name: 'Cambodia',
                code: 'KH'
            });

            countryId = country._id;
        });
        afterEach(async () => {
            await country.remove();
        });

        const exec = () =>
            request(server).get(`/api/v1/countries/${countryId}`);

        it('should return 404 if object ID is not valid', async () => {
            countryId = 1;
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 404 if object ID of country does not exist', async () => {
            countryId = mongoose.Types.ObjectId();
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 200, and return the country if object ID is valid and exists', async () => {
            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveProperty(
                '_id',
                countryId.toHexString()
            );
            expect(res.body.data).toHaveProperty('name', 'Cambodia');
            expect(res.body.data).toHaveProperty('code', 'KH');
            expect(res.body.data).toHaveProperty('createdAt');
        });
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

    describe('PUT /api/v1/countries/:id', () => {
        let country;
        let countryId;

        beforeEach(async () => {
            country = await Country.create({
                name: 'Cambodia',
                code: 'KH'
            });

            countryId = country._id;
        });
        afterEach(async () => {
            await country.remove();
        });

        const exec = () =>
            request(server).put(`/api/v1/countries/${countryId}`);

        it('should return 404 if object ID is not valid', async () => {
            countryId = 1;
            const res = await exec().send({});

            expect(res.status).toBe(404);
        });

        it('should return 404 if object ID of country does not exist', async () => {
            countryId = mongoose.Types.ObjectId();
            const res = await exec().send({});

            expect(res.status).toBe(404);
        });

        it('should return 400 if name is not a string', async () => {
            const res = await exec().send({ name: true });

            expect(res.status).toBe(400);
        });

        it('should return 400 if name is an empty string', async () => {
            const res = await exec().send({ name: '' });

            expect(res.status).toBe(400);
        });

        it('should return 400 if name is more than 100 characters', async () => {
            const name = new Array(102).join('a');

            const res = await exec().send({ name });

            expect(res.status).toBe(400);
        });

        it('should return 400 if name is duplicated', async () => {
            await Country.create({ name: 'England', code: 'EN' });

            const res = await exec().send({ name: 'England' });

            expect(res.status).toBe(400);
        });

        it('should return 400 if code is not a string', async () => {
            const res = await exec().send({ code: true });

            expect(res.status).toBe(400);
        });

        it('should return 400 if code is an empty string', async () => {
            const res = await exec().send({ code: '' });

            expect(res.status).toBe(400);
        });

        it('should return 400 if code is more than 2 characters', async () => {
            const res = await exec().send({ code: 'aaa' });

            expect(res.status).toBe(400);
        });

        it('should return 400 if code is duplicated', async () => {
            await Country.create({ name: 'England', code: 'EN' });

            const res = await exec().send({ code: 'EN' });

            expect(res.status).toBe(400);
        });

        it('should return 200, and update the country it request is valid', async () => {
            const res = await exec().send({ name: 'England', code: 'EN' });

            const countryInDb = await Country.findById(countryId);

            expect(res.status).toBe(200);
            expect(countryInDb.name).toBe('England');
            expect(countryInDb.code).toBe('EN');
            expect(countryInDb.updatedAt).not.toBeNull();
        });

        it('should return 200, and return the updated country if request is valid', async () => {
            const res = await exec().send({ name: 'England', code: 'KH' });

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveProperty(
                '_id',
                countryId.toHexString()
            );
            expect(res.body.data).toHaveProperty('name', 'England');
            expect(res.body.data).toHaveProperty('code', 'KH');
            expect(res.body.data).toHaveProperty('updatedAt');
        });
    });

    describe('DELETE /api/v1/countries', () => {
        let country;
        let countryId;

        beforeEach(async () => {
            country = await Country.create({
                name: 'Cambodia',
                code: 'KH'
            });

            countryId = country._id;
        });
        afterEach(async () => {
            await country.remove();
        });

        const exec = () =>
            request(server).delete(`/api/v1/countries/${countryId}`);

        it('should return 404 if object ID is not valid', async () => {
            countryId = 1;
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 404 if object ID of country does not exist', async () => {
            countryId = mongoose.Types.ObjectId();
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 200, and delete the country if object ID is valid and exists', async () => {
            const res = await exec();

            const countryInDb = await Country.findById(countryId);

            expect(res.status).toBe(200);
            expect(countryInDb).toBeNull();
        });

        it('should return 200, and return the deleted country if object ID is valid and exists', async () => {
            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveProperty(
                '_id',
                countryId.toHexString()
            );
            expect(res.body.data).toHaveProperty('name', 'Cambodia');
            expect(res.body.data).toHaveProperty('code', 'KH');
        });
    });
});
