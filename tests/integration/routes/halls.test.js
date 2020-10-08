const request = require('supertest');
const { Hall } = require('../../../models/Hall');
const mongoose = require('mongoose');
let server;

describe('/api/v1/halls', () => {
    beforeAll(() => {
        server = require('../../../server');
    });
    afterAll(async () => {
        await server.close();
    });
    afterEach(async () => {
        await Hall.deleteMany();
    });

    describe('GET /', () => {
        it('should return 200, and return all the halls', async () => {
            await Hall.create([
                {
                    name: 'Hall One',
                    seatRows: ['A', 'B', 'C', 'D'],
                    seatColumns: [1, 2, 3, 4]
                },
                {
                    name: 'Hall Two',
                    seatRows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
                    seatColumns: [1, 2, 3, 4, 5, 6, 7]
                }
            ]);

            const res = await request(server).get('/api/v1/halls');
            const { items } = res.body.data;

            expect(res.status).toBe(200);

            expect(items.some((h) => h.name === 'Hall One')).toBeTruthy();
            expect(items.some((h) => h.name === 'Hall Two')).toBeTruthy();
            expect(items.some((h) => h.seatRows.length === 4)).toBeTruthy();
            expect(items.some((h) => h.seatColumns.length === 4)).toBeTruthy();
            expect(items.some((h) => h.seatRows.length === 8)).toBeTruthy();
            expect(items.some((h) => h.seatColumns.length === 7)).toBeTruthy();

            expect(items.length).toBe(2);
        });
    });

    describe('GET /:id', () => {
        let hallId;
        const exec = () => request(server).get(`/api/v1/halls/${hallId}`);

        it('should return 404 if object ID provided is not valid', async () => {
            hallId = 1;
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 404 if hall ID provided does not exist', async () => {
            hallId = mongoose.Types.ObjectId();
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 200, and return the hall if hall ID is valid and exists', async () => {
            const hall = await Hall.create({
                name: 'Hall One',
                seatRows: ['A', 'B', 'C', 'D'],
                seatColumns: [1, 2, 3, 4]
            });

            hallId = hall._id;
            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveProperty('_id', hallId.toHexString());
            expect(res.body.data).toHaveProperty('name', 'Hall One');
            expect(res.body.data).toHaveProperty('seatRows', [
                'A',
                'B',
                'C',
                'D'
            ]);
            expect(res.body.data).toHaveProperty('seatColumns', [
                '1',
                '2',
                '3',
                '4'
            ]);
        });
    });

    describe('POST /', () => {
        const data = {
            name: 'Hall One',
            seatRows: ['A', 'B', 'C', 'D'],
            seatColumns: [1, 2, 3, 4]
        };

        const exec = () => request(server).post('/api/v1/halls');

        it('should return 400 if name is not provided', async () => {
            const curData = { ...data };
            delete curData.name;

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if name is less than 5 characters', async () => {
            const curData = { ...data };
            curData.name = 'aaaa';

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if name is more than 100 characters', async () => {
            const curData = { ...data };
            const name = new Array(102).join('a');
            curData.name = name;

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if name is duplicated', async () => {
            const res1 = await exec().send(data);
            const res2 = await exec().send(data);

            expect(res1.status).toBe(201);
            expect(res2.status).toBe(400);
        });

        it('should return 400 if seatRows is not provided', async () => {
            const curData = { ...data };
            delete curData.seatRows;

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if seatRows is an empty array', async () => {
            const curData = { ...data };
            curData.seatRows = [];

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if seatRows is not an array of only string or number', async () => {
            const curData = { ...data };
            curData.seatRows = [1, '2', true];

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if seatColumns is not provided', async () => {
            const curData = { ...data };
            delete curData.seatColumns;

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if seatColumns is an empty array', async () => {
            const curData = { ...data };
            curData.seatColumns = [];

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if seatColumns is not any array of only string or number', async () => {
            const curData = { ...data };
            curData.seatColumns = [1, '2', true];

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 201, and save the hall if the request body is valid', async () => {
            const res = await exec().send(data);

            const hall = await Hall.find({ name: 'Hall One' });

            expect(res.status).toBe(201);
            expect(hall).not.toBeNull();
        });

        it('should return 201, and return the hall if the request body is valid', async () => {
            const res = await exec().send(data);

            expect(res.status).toBe(201);
            expect(res.body.data).toHaveProperty('_id');
            expect(res.body.data).toHaveProperty('name', 'Hall One');
            expect(res.body.data).toHaveProperty('seatRows', [
                'A',
                'B',
                'C',
                'D'
            ]);
            expect(res.body.data).toHaveProperty('seatColumns', [
                '1',
                '2',
                '3',
                '4'
            ]);
        });
    });

    describe('PUT /:id', () => {
        let hall;
        let hallId;

        beforeEach(async () => {
            hall = await Hall.create({
                name: 'Hall One',
                seatRows: ['A', 'B', 'C', 'D'],
                seatColumns: [1, 2, 3, 4]
            });

            hallId = hall._id;
        });

        afterEach(async () => {
            await hall.remove();
        });

        const exec = () => request(server).put(`/api/v1/halls/${hallId}`);

        it('should return 400 if name is less than 5 characters', async () => {
            const res = await exec().send({ name: 'aaaa' });

            expect(res.status).toBe(400);
        });

        it('should return 400 if name is more than 100 characters', async () => {
            const name = new Array(102).join('a');
            const res = await exec().send({ name });

            expect(res.status).toBe(400);
        });

        it('should return 400 if seatRows is an empty array', async () => {
            const res = await exec().send({ seatRows: [] });

            expect(res.status).toBe(400);
        });

        it('should return 400 if seatRows is not an array of only string or numnber', async () => {
            const res = await exec().send({ seatRows: [1, '2', true] });

            expect(res.status).toBe(400);
        });

        it('should return 400 if seatColumns is an empty array', async () => {
            const res = await exec().send({ seatColumns: [] });

            expect(res.status).toBe(400);
        });

        it('should return 400 if seatColumns is not an array of only string or number', async () => {
            const res = await exec().send({ seatColumns: [1, '2', true] });

            expect(res.status).toBe(400);
        });

        it('should return 404 if object ID is not valid', async () => {
            hallId = 1;
            const res = await exec().send({});

            expect(res.status).toBe(404);
        });

        it('should return 404 if hall ID does not exists', async () => {
            hallId = mongoose.Types.ObjectId();
            const res = await exec().send({});

            expect(res.status).toBe(404);
        });

        it('should return 200, and update the hall if the request is valid', async () => {
            const res = await exec().send({
                name: 'Hall qwe',
                seatRows: ['A', 'B'],
                seatColumns: ['I', 'II', 'III']
            });

            const hallInDb = await Hall.findById(hallId);

            expect(res.status).toBe(200);
            expect(hallInDb.name).toBe('Hall qwe');
            expect(hallInDb.seatRows).toHaveLength(2);
            expect(hallInDb.seatRows).not.toEqual(res.body.data.seatRows);
            expect(hallInDb.seatColumns).toHaveLength(3);
            expect(hallInDb.seatColumns).not.toEqual(res.body.data.seatColumns);
        });

        it('should return 200, and return the updated hall if the request is valid', async () => {
            const res = await exec().send({
                name: 'Hall qwe',
                seatRows: ['A', 'B'],
                seatColumns: ['I', 'II', 'III']
            });

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveProperty('_id', hallId.toHexString());
            expect(res.body.data).toHaveProperty('name', 'Hall qwe');
            expect(res.body.data).toHaveProperty('seatRows', ['A', 'B']);
            expect(res.body.data).toHaveProperty('seatColumns', [
                'I',
                'II',
                'III'
            ]);
        });
    });
});
