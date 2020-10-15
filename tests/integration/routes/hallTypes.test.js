const request = require('supertest');
const mongoose = require('mongoose');
const { HallType } = require('../../../models/HallType');
const { MovieType } = require('../../../models/MovieType');
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

    describe('GET /api/movie-types/:movieTypeId/compatible-hall-types', () => {
        let movieType2D;
        let movieType3D;
        let movieTypeId;

        beforeEach(async () => {
            movieType2D = await MovieType.create({
                name: '2D',
                description: 'Simple 2D technology'
            });

            movieType3D = await MovieType.create({
                name: '3D',
                description: 'Exciting 3D technology with surrounding sounds'
            });

            const hallTypes = await HallType.create([
                {
                    name: '2D/3D Hall',
                    description: 'Equipped with 2D/3D technology',
                    compatibleMovieTypes: [
                        movieType2D._id.toHexString(),
                        movieType3D._id.toHexString()
                    ]
                },
                {
                    name: '4DX Hall',
                    description: 'Equipped with motion and comfortable seats',
                    compatibleMovieTypes: [movieType3D._id.toHexString()]
                }
            ]);

            movieTypeId = movieType2D._id;
        });

        afterEach(async () => {
            await HallType.deleteMany();
            await MovieType.deleteMany();
        });

        const exec = () =>
            request(server).get(
                `/api/v1/movie-types/${movieTypeId}/compatible-hall-types`
            );

        it('should return 404 if object ID of movie type is not valid', async () => {
            movieTypeId = 1;
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 404 if object Id of movie type does not exist', async () => {
            movieTypeId = mongoose.Types.ObjectId();
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 200, and return all the 2 compatible hall types of 3D movie if request is valid', async () => {
            movieTypeId = movieType3D._id;
            const res = await exec();
            const { items } = res.body.data;

            expect(res.status).toBe(200);
            expect(items.some((h) => h.name === '2D/3D Hall')).toBeTruthy();
            expect(items.some((h) => h.name === '4DX Hall')).toBeTruthy();
            expect(items).toHaveLength(2);
        });

        it('should return 200, and return only 1 compatible hall type of 2D movie if request is valid', async () => {
            movieTypeId = movieType2D._id;
            const res = await exec();
            const { items } = res.body.data;

            expect(res.status).toBe(200);
            expect(items.some((h) => h.name === '2D/3D Hall')).toBeTruthy();
            expect(items.some((h) => h.name === '4DX Hall')).not.toBeTruthy();
            expect(items).toHaveLength(1);
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
        let movieTypes;
        let movieTypeIds;

        const data = {
            name: '4DX Hall',
            description: 'Equipped with motion and comfortable seats'
        };

        beforeEach(async () => {
            movieTypes = await MovieType.create([
                {
                    name: '2D',
                    description: 'Simple 2D technology'
                },
                {
                    name: '3D',
                    description:
                        'Exciting 3D technology with surrounding sounds'
                }
            ]);

            movieTypeIds = movieTypes.map((m) => m._id);
            data.compatibleMovieTypeIds = movieTypeIds;
        });

        afterEach(async () => {
            await MovieType.deleteMany();
        });

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

        it('should return 400 if compatibleMovieTypeIds is not provided', async () => {
            const curData = { ...data };
            delete curData.compatibleMovieTypeIds;

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if compatibleMovieTypeIds is an empty array', async () => {
            const curData = { ...data };
            curData.compatibleMovieTypeIds = [];

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if compatibleMovieTypeIds is not an array of only string', async () => {
            const curData = { ...data };
            curData.compatibleMovieTypeIds = [1, 2];

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if any id of compatibleMovieTypeIds is not a valid object Id', async () => {
            const curData = { ...data };
            curData.compatibleMovieTypeIds = [1, mongoose.Types.ObjectId()];

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 404 if any id of compatibleMovieTypeIds does not exist', async () => {
            const curData = { ...data };
            curData.compatibleMovieTypeIds = [
                mongoose.Types.ObjectId(),
                mongoose.Types.ObjectId()
            ];

            const res = await exec().send(curData);

            expect(res.status).toBe(404);
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
            expect(res.body.data).toHaveProperty('compatibleMovieTypes');
            expect(res.body.data.compatibleMovieTypes).toHaveLength(2);
        });
    });

    describe('PUT /api/v1/hall-types/:id', () => {
        let hallType;
        let hallTypeId;
        let movieType;
        let movieTypeId;

        beforeEach(async () => {
            hallType = await HallType.create({
                name: '4DX Hall',
                description: 'Equipped with motion and comfortable seats'
            });

            hallTypeId = hallType._id;

            movieType = await MovieType.create({
                name: '2D',
                description: 'Simple 2D technology'
            });

            movieTypeId = movieType._id;
        });
        afterEach(async () => {
            await hallType.remove();
            await movieType.remove();
        });

        const exec = () =>
            request(server).put(`/api/v1/hall-types/${hallTypeId}`);

        it('should return 404 if object ID of hall type is not valid', async () => {
            hallTypeId = 1;
            const res = await exec().send({});

            expect(res.status).toBe(404);
        });

        it('should return 404 if object ID of hall type does not exists', async () => {
            hallTypeId = mongoose.Types.ObjectId();
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

        it('should return 400 if description is not a string', async () => {
            const res = await exec().send({ description: true });

            expect(res.status).toBe(400);
        });

        it('should return 400 if description is an empty string', async () => {
            const res = await exec().send({ description: '' });

            expect(res.status).toBe(400);
        });

        it('should return 400 if compatibleMovieTypeIds is an empty array', async () => {
            const res = await exec().send({ compatibleMovieTypeIds: [] });

            expect(res.status).toBe(400);
        });

        it('should return 400 if compatibleMovieTypeIds is not an array of only string', async () => {
            const res = await exec().send({ compatibleMovieTypeIds: [1, 2] });

            expect(res.status).toBe(400);
        });

        it('should return 400 if any id of compatibleMovieTypeIds is not a valid object Id', async () => {
            const res = await exec().send({
                compatibleMovieTypeIds: [1, mongoose.Types.ObjectId()]
            });

            expect(res.status).toBe(400);
        });

        it('should return 404 if any id of compatibleMovieTypeIds does not exist', async () => {
            const res = await exec().send({
                compatibleMovieTypeIds: [
                    mongoose.Types.ObjectId(),
                    mongoose.Types.ObjectId()
                ]
            });

            expect(res.status).toBe(404);
        });

        it('should return 200, and update the hall type if request is valid', async () => {
            const res = await exec().send({
                name: 'qwe',
                description: 'des-qwe',
                compatibleMovieTypeIds: [movieTypeId]
            });

            const hallTypeInDb = await HallType.findById(hallTypeId);

            expect(res.status).toBe(200);
            expect(hallTypeInDb.name).toBe('qwe');
            expect(hallTypeInDb.description).toBe('des-qwe');
            expect(hallTypeInDb.compatibleMovieTypes).toContain(
                movieTypeId.toHexString()
            );
            expect(hallTypeInDb.updatedAt).not.toBeNull();
        });

        it('should return 200, and return the updated hall type if request is valid', async () => {
            const res = await exec().send({
                name: 'qwe',
                description: 'des-qwe',
                compatibleMovieTypeIds: [movieTypeId]
            });

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveProperty(
                '_id',
                hallTypeId.toHexString()
            );
            expect(res.body.data).toHaveProperty('name', 'qwe');
            expect(res.body.data).toHaveProperty('description', 'des-qwe');
            expect(res.body.data).toHaveProperty('compatibleMovieTypes');
            expect(res.body.data).toHaveProperty('updatedAt');
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
