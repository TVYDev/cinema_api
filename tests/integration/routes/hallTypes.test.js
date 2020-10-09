const request = require('supertest');
const mongoose = require('mongoose');
const { HallType } = require('../../../models/HallType');
let server;

describe('Hall Types', () => {
    beforeAll(() => {
        server = require('../../../server');
    });
    afterAll(async () => {
        await server.close();
    });
    afterEach(async () => {
        await HallType.deleteMany();
    });

    describe('GET /api/v1/hall-types', () => {
        it('should return 200, and return all the hall types', async () => {
            await HallType.create([
                {
                    name: '2D/3D Hall',
                    description: 'Equipped with 2D/3D technology'
                },
                {
                    name: '4DX Hall',
                    description: 'Equipped with motion and comfortable seats'
                }
            ]);

            const res = await request(server).get('/api/v1/hall-types');
            const { items } = res.body.data;

            expect(res.status).toBe(200);
            expect(items.some((h) => h.name === '2D/3D Hall')).toBeTruthy();
            expect(items.some((h) => h.name === '4DX Hall')).toBeTruthy();
            expect(
                items.some(
                    (h) => h.description === 'Equipped with 2D/3D technology'
                )
            ).toBeTruthy();
            expect(
                items.some(
                    (h) =>
                        h.description ===
                        'Equipped with motion and comfortable seats'
                )
            ).toBeTruthy();
            expect(items).toHaveLength(2);
        });
    });

    describe('GET /api/v1/hall-types/:id', () => {
        let hallType;
        let hallTypeId;

        beforeEach(async () => {
            hallType = await HallType.create({
                name: '4DX Hall',
                description: 'Equipped with motion and comfortable seats'
            });

            hallTypeId = hallType._id;
        });
        afterEach(async () => {
            await hallType.remove();
        });

        const exec = () =>
            request(server).get(`/api/v1/hall-types/${hallTypeId}`);

        it('should return 404 if object ID is not valid', async () => {
            hallTypeId = 1;
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 404 if object ID of hall type does not exist', async () => {
            hallTypeId = mongoose.Types.ObjectId();
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 200, and return the hall if object ID is valid and exists', async () => {
            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveProperty(
                '_id',
                hallTypeId.toHexString()
            );
            expect(res.body.data).toHaveProperty('name', '4DX Hall');
            expect(res.body.data).toHaveProperty(
                'description',
                'Equipped with motion and comfortable seats'
            );
        });
    });

    describe('POST /api/v1/hall-types', () => {
        const data = {
            name: '4DX Hall',
            description: 'Equipped with motion and comfortable seats'
        };

        const exec = () => request(server).post('/api/v1/hall-types');

        it('should return 400 if name is not provided', async () => {
            const curData = { ...data };
            delete curData.name;
            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if name is an empty string', async () => {
            const curData = { ...data };
            curData.name = '';
            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if name is more than 50 characters', async () => {
            const curData = { ...data };
            const name = new Array(52).join('a');
            curData.name = name;
            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if name is not a string', async () => {
            const curData = { ...data };
            curData.name = true;
            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if description is not provided', async () => {
            const curData = { ...data };
            delete curData.description;
            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if description is an empty string', async () => {
            const curData = { ...data };
            curData.name = '';
            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if description is not a string', async () => {
            const curData = { ...data };
            curData.description = true;
            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 201, and save the hall type if request is valid', async () => {
            const res = await exec().send(data);

            const hallTypeInDb = await HallType.find({ name: '4DX Hall' });

            expect(res.status).toBe(201);
            expect(hallTypeInDb).not.toBeNull();
        });

        it('should returnn 201, and return the hall type if request is valid', async () => {
            const res = await exec().send(data);

            expect(res.status).toBe(201);
            expect(res.body.data).toHaveProperty('_id');
            expect(res.body.data).toHaveProperty('name', '4DX Hall');
            expect(res.body.data).toHaveProperty(
                'description',
                'Equipped with motion and comfortable seats'
            );
        });
    });

    describe('DELETE /api/v1/hall-types/:id', () => {
        let hallType;
        let hallTypeId;

        beforeEach(async () => {
            hallType = await HallType.create({
                name: '4DX Hall',
                description: 'Equipped with motion and comfortable seats'
            });

            hallTypeId = hallType._id;
        });
        afterEach(async () => {
            await hallType.remove();
        });

        const exec = () =>
            request(server).delete(`/api/v1/hall-types/${hallTypeId}`);

        it('should return 404 if object ID is not valid', async () => {
            hallTypeId = 1;
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 404 if object ID does not exists', async () => {
            hallTypeId = mongoose.Types.ObjectId();
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 200, and delete the hall type if object ID is valid and exists', async () => {
            const res = await exec();

            const hallTypeInDb = await HallType.findById(hallTypeId);

            expect(res.status).toBe(200);
            expect(hallTypeInDb).toBeNull();
        });

        it('should return 200, and return the deleted hall type if object ID is valid and exists', async () => {
            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveProperty(
                '_id',
                hallTypeId.toHexString()
            );
            expect(res.body.data).toHaveProperty('name', '4DX Hall');
            expect(res.body.data).toHaveProperty(
                'description',
                'Equipped with motion and comfortable seats'
            );
        });
    });
});
