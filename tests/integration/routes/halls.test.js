const request = require('supertest');
const { Hall } = require('../../../models/Hall');
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
});
