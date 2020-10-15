const request = require('supertest');
const { Hall } = require('../../../models/Hall');
const { Cinema } = require('../../../models/Cinema');
const { HallType } = require('../../../models/HallType');
const { MovieType } = require('../../../models/MovieType');
const mongoose = require('mongoose');
const fs = require('fs');
let server;

describe('Halls', () => {
    beforeAll(() => {
        server = require('../../../server');
    });
    afterAll(async () => {
        await server.close();
    });
    afterEach(async () => {
        await Hall.deleteMany();
    });

    describe('GET /api/v1/halls', () => {
        it('should return 200, and return all the halls', async () => {
            await Hall.create([
                {
                    name: 'Hall One',
                    seatRows: ['A', 'B', 'C', 'D'],
                    seatColumns: [1, 2, 3, 4],
                    cinema: mongoose.Types.ObjectId(),
                    hallType: mongoose.Types.ObjectId()
                },
                {
                    name: 'Hall Two',
                    seatRows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
                    seatColumns: [1, 2, 3, 4, 5, 6, 7],
                    cinema: mongoose.Types.ObjectId(),
                    hallType: mongoose.Types.ObjectId()
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

    describe('GET /api/v1/cinemas/:cinemaId/halls', () => {
        let cinema;
        let cinemaId;

        beforeEach(async () => {
            cinema = await Cinema.create({
                name: 'Delee Cinma Phnom Penh',
                address: 'Toul Kork, Phnom Penh, Cambodia',
                openingHours: '7AM - 10PM'
            });

            cinemaId = cinema._id;
        });

        afterEach(async () => {
            await cinema.remove();
        });

        const exec = () =>
            request(server).get(`/api/v1/cinemas/${cinemaId}/halls`);

        it('should return 404 if object ID of cinema is not valid', async () => {
            cinemaId = 1;
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 404 if object ID of cinema does not exists', async () => {
            cinemaId = mongoose.Types.ObjectId();
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 200, and return all the halls of the cinema', async () => {
            await Hall.create([
                {
                    name: 'Hall One',
                    seatRows: ['A', 'B', 'C', 'D'],
                    seatColumns: [1, 2, 3, 4],
                    cinema: cinemaId,
                    hallType: mongoose.Types.ObjectId()
                },
                {
                    name: 'Hall Two',
                    seatRows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
                    seatColumns: [1, 2, 3, 4, 5, 6, 7],
                    cinema: cinemaId,
                    hallType: mongoose.Types.ObjectId()
                }
            ]);

            const res = await exec();
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

    describe('GET /api/v1/hall-types/:hallTypeId/halls', () => {
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
            request(server).get(`/api/v1/hall-types/${hallTypeId}/halls`);

        it('should return 404 if object ID of hall type is not valid', async () => {
            hallTypeId = 1;
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 404 if object ID of hall type does not exist', async () => {
            hallTypeId = mongoose.Types.ObjectId();
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 200, and return all the halls of the hall type if object Id is valid and exists', async () => {
            await Hall.create([
                {
                    name: 'Hall One',
                    seatRows: ['A', 'B', 'C', 'D'],
                    seatColumns: [1, 2, 3, 4],
                    cinema: mongoose.Types.ObjectId(),
                    hallType: hallTypeId
                },
                {
                    name: 'Hall Two',
                    seatRows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
                    seatColumns: [1, 2, 3, 4, 5, 6, 7],
                    cinema: mongoose.Types.ObjectId(),
                    hallType: hallTypeId
                }
            ]);

            const res = await exec();
            const { items } = res.body.data;

            expect(res.status).toBe(200);
            expect(items.some((h) => h.name === 'Hall One')).toBeTruthy();
            expect(items.some((h) => h.name === 'Hall Two')).toBeTruthy();

            expect(items).toHaveLength(2);
        });
    });

    describe('GET /api/v1/halls/:id', () => {
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
                seatColumns: [1, 2, 3, 4],
                cinema: mongoose.Types.ObjectId(),
                hallType: mongoose.Types.ObjectId()
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

    describe('POST /api/v1/cinemas/:cinemaId/halls', () => {
        let cinema;
        let cinemaId;
        let hallType;
        let hallTypeId;

        const data = {
            name: 'Hall One',
            seatRows: ['A', 'B', 'C', 'D'],
            seatColumns: [1, 2, 3, 4]
        };

        beforeEach(async () => {
            cinema = await Cinema.create({
                name: 'Delee Cinma Phnom Penh',
                address: 'Toul Kork, Phnom Penh, Cambodia',
                openingHours: '7AM - 10PM'
            });

            cinemaId = cinema._id;

            hallType = await HallType.create({
                name: '4DX Hall',
                description: 'Equipped with motion and comfortable seats'
            });

            hallTypeId = hallType._id;
            data.hallTypeId = hallType._id;
        });

        afterEach(async () => {
            await cinema.remove();
            await hallType.remove();
        });

        const exec = () =>
            request(server).post(`/api/v1/cinemas/${cinemaId}/halls`);

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

        it('should return 404 if cinema object id is not valid', async () => {
            cinemaId = 1;
            const res = await exec().send(data);

            expect(res.status).toBe(404);
        });

        it('should return 404 if cinema id does not exists', async () => {
            cinemaId = mongoose.Types.ObjectId();
            const res = await exec().send(data);

            expect(res.status).toBe(404);
        });

        it('should return 400 if hallTypeId is not provided', async () => {
            const curData = { ...data };
            delete curData.hallTypeId;

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if hallTypeId is not a valid object Id', async () => {
            const curData = { ...data };
            curData.hallTypeId = 1;

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 404 if hallTypeId does not exist', async () => {
            const curData = { ...data };
            curData.hallTypeId = mongoose.Types.ObjectId();

            const res = await exec().send(curData);

            expect(res.status).toBe(404);
        });

        it('should return 201, and save the hall to the cinema if the request body is valid', async () => {
            const res = await exec().send(data);

            const hall = await Hall.find({
                name: 'Hall One',
                cinema: cinemaId,
                hallType: mongoose.Types.ObjectId()
            });

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
            expect(res.body.data).toHaveProperty(
                'cinema',
                cinemaId.toHexString()
            );
            expect(res.body.data).toHaveProperty(
                'hallType',
                hallTypeId.toHexString()
            );
        });
    });

    describe('PUT /api/v1/halls/:id', () => {
        let hall;
        let hallId;
        let hallType;
        let hallTypeId;

        beforeEach(async () => {
            hall = await Hall.create({
                name: 'Hall One',
                seatRows: ['A', 'B', 'C', 'D'],
                seatColumns: [1, 2, 3, 4],
                cinema: mongoose.Types.ObjectId(),
                hallType: mongoose.Types.ObjectId()
            });

            hallId = hall._id;

            hallType = await HallType.create({
                name: '2D/3D Hall',
                description: 'Equipped with 2D/3D technology',
                compatibleMovieTypes: [mongoose.Types.ObjectId()]
            });

            hallTypeId = hallType._id;
        });

        afterEach(async () => {
            await hall.remove();
            await hallType.remove();
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

        it('should return 400 if hallTypeId is not a valid object Id', async () => {
            const res = await exec().send({ hallTypeId: 1 });

            expect(res.status).toBe(400);
        });

        it('should return 404 if hallTypeId does not exist', async () => {
            const res = await exec().send({
                hallTypeId: mongoose.Types.ObjectId()
            });

            expect(res.status).toBe(404);
        });

        it('should return 404 if object ID of hall is not valid', async () => {
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
                seatColumns: ['I', 'II', 'III'],
                hallTypeId
            });

            const hallInDb = await Hall.findById(hallId);

            expect(res.status).toBe(200);
            expect(hallInDb.name).toBe('Hall qwe');
            expect(hallInDb.seatRows).toHaveLength(2);
            expect(hallInDb.seatRows).not.toEqual(res.body.data.seatRows);
            expect(hallInDb.seatColumns).toHaveLength(3);
            expect(hallInDb.seatColumns).not.toEqual(res.body.data.seatColumns);
            expect(hallInDb.hallType).toBe(hallTypeId.toHexString());
        });

        it('should return 200, and return the updated hall if the request is valid', async () => {
            const res = await exec().send({
                name: 'Hall qwe',
                seatRows: ['A', 'B'],
                seatColumns: ['I', 'II', 'III'],
                hallTypeId
            });

            const { data } = res.body;

            expect(res.status).toBe(200);
            expect(data).toHaveProperty('_id', hallId.toHexString());
            expect(data).toHaveProperty('name', 'Hall qwe');
            expect(data).toHaveProperty('seatRows', ['A', 'B']);
            expect(data).toHaveProperty('seatColumns', ['I', 'II', 'III']);
            expect(data).toHaveProperty('hallType');
        });
    });

    describe('DELETE /api/v1/halls/:id', () => {
        let hall;
        let hallId;

        beforeEach(async () => {
            hall = await Hall.create({
                name: 'Hall One',
                seatRows: ['A', 'B', 'C', 'D'],
                seatColumns: [1, 2, 3, 4],
                cinema: mongoose.Types.ObjectId(),
                hallType: mongoose.Types.ObjectId()
            });

            hallId = hall._id;
        });
        afterEach(async () => {
            await hall.remove();
        });

        const exec = () => request(server).delete(`/api/v1/halls/${hallId}`);

        it('should return 404 if object id is valid', async () => {
            hallId = 1;
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 404 if hall id does not exist', async () => {
            hallId = mongoose.Types.ObjectId();
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 200, and delete the hall if the request is valid', async () => {
            const res = await exec();

            const hallInDb = await Hall.findById(hallId);

            expect(res.status).toBe(200);
            expect(hallInDb).toBeNull();
        });

        it('should return 200, and return the deleted hall if the request is valid', async () => {
            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveProperty('_id', hallId.toHexString());
            expect(res.body.data).toHaveProperty('name', 'Hall One');
        });
    });

    describe('PUT /api/v1/halls/:id/location-image', () => {
        let hall;
        let hallId;
        let imageFileUrl = './tests/test_files/test_image_valid.jpg';
        let textFileUrl = './tests/test_files/test_text.txt';
        let imageFileExceeds1MBUrl =
            './tests/test_files/test_image_exceeds_1MB.jpg';
        let createdFileUrl = undefined;

        beforeEach(async () => {
            hall = await Hall.create({
                name: 'Hall One',
                seatRows: ['A', 'B', 'C', 'D'],
                seatColumns: [1, 2, 3, 4],
                cinema: mongoose.Types.ObjectId(),
                hallType: mongoose.Types.ObjectId()
            });

            hallId = hall._id;
        });
        afterEach(async () => {
            await hall.remove();
            if (createdFileUrl !== undefined) {
                fs.unlinkSync(createdFileUrl);
            }
        });

        const exec = () =>
            request(server).put(`/api/v1/halls/${hallId}/location-image`);

        it('should return 404 if object id is not valid', async () => {
            hallId = 1;
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 404 if hall id does not exists', async () => {
            hallId = mongoose.Types.ObjectId();
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 400 if there is no uploaded file', async () => {
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if uploaded file is not an image file', async () => {
            const res = await exec().attach('file', textFileUrl);

            expect(res.status).toBe(400);
        });

        it('should return 400 if uploaded file exceeds 1MB maximum size', async () => {
            const res = await exec().attach('file', imageFileExceeds1MBUrl);

            expect(res.status).toBe(400);
        });

        it('should return 200, and save the image to the uploads directory', async () => {
            const res = await exec().attach('file', imageFileUrl);
            createdFileUrl = `${process.env.FILE_UPLOAD_PATH}/${res.body.data.locationImage}`;

            expect(res.status).toBe(200);
            expect(fs.existsSync(createdFileUrl)).toBeTruthy();
        });

        it('should return 200, and return the hall with location image field with updated value', async () => {
            const res = await exec().attach('file', imageFileUrl);
            createdFileUrl = `${process.env.FILE_UPLOAD_PATH}/${res.body.data.locationImage}`;

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveProperty('locationImage');
            expect(res.body.data.locationImage).not.toBe('no-photo.jpg');
        });
    });
});
