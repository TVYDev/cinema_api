const request = require('supertest');
const { Genre } = require('../../../models/Genre');
const mongoose = require('mongoose');
let server;

describe('Genres', () => {
    beforeAll(() => {
        server = require('../../../server');
    });
    afterAll(async () => {
        await server.close();
    });
    afterEach(async () => {
        await Genre.deleteMany();
    });

    describe('GET /api/v1/genres', () => {
        it('should return 200, and return all the genres', async () => {
            await Genre.create([
                {
                    name: 'Action',
                    description: 'Fighting scenes'
                },
                {
                    name: 'Horror',
                    description: 'Ghosts, scary things'
                }
            ]);

            const res = await request(server).get('/api/v1/genres');
            const { items } = res.body.data;

            expect(res.status).toBe(200);
            expect(items.some((g) => g.name === 'Action')).toBeTruthy();
            expect(items.some((g) => g.name === 'Horror')).toBeTruthy();
            expect(
                items.some((g) => g.description === 'Fighting scenes')
            ).toBeTruthy();
            expect(
                items.some((g) => g.description === 'Ghosts, scary things')
            ).toBeTruthy();
            expect(items).toHaveLength(2);
        });
    });

    describe('GET /api/v1/genres/:id', () => {
        let genre;
        let genreId;

        beforeEach(async () => {
            genre = await Genre.create({
                name: 'Action',
                description: 'Fighting scenes'
            });

            genreId = genre._id;
        });
        afterEach(async () => {
            await genre.remove();
        });

        const exec = () => request(server).get(`/api/v1/genres/${genreId}`);

        it('should return 404 if object ID is not valid', async () => {
            genreId = 1;
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 404 if object ID of genre does not exist', async () => {
            genreId = mongoose.Types.ObjectId();
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 200, and return the genre if request is valid', async () => {
            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveProperty('_id', genreId.toHexString());
            expect(res.body.data).toHaveProperty('name', 'Action');
            expect(res.body.data).toHaveProperty(
                'description',
                'Fighting scenes'
            );
        });
    });

    describe('POST /api/v1/genres', () => {
        const data = {
            name: 'Action',
            description: 'Fighting scenes'
        };

        const exec = () => request(server).post('/api/v1/genres');

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

        it('should return 400 if name is more than 50 characters', async () => {
            const curData = { ...data };
            const name = new Array(52).join('a');
            curData.name = name;
            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if description is not provided', async () => {
            const curData = { ...data };
            delete curData.description;
            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if description is not a string', async () => {
            const curData = { ...data };
            curData.description = true;
            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if description is an empty string', async () => {
            const curData = { ...data };
            curData.description = '';
            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 201, and create the genre if the request is valid', async () => {
            const res = await exec().send(data);

            const genreInDb = await Genre.find({ name: 'Action' });

            expect(res.status).toBe(201);
            expect(genreInDb).not.toBeNull();
        });

        it('should return 201, and return the created genre if the request is valid', async () => {
            const res = await exec().send(data);

            expect(res.status).toBe(201);
            expect(res.body.data).toHaveProperty('_id');
            expect(res.body.data).toHaveProperty('name', 'Action');
            expect(res.body.data).toHaveProperty(
                'description',
                'Fighting scenes'
            );
        });
    });

    describe('PUT /api/v1/genres/:id', () => {
        let genre;
        let genreId;

        beforeEach(async () => {
            genre = await Genre.create({
                name: 'Action',
                description: 'Fighting scenes'
            });

            genreId = genre._id;
        });
        afterEach(async () => {
            await genre.remove();
        });

        const exec = () => request(server).put(`/api/v1/genres/${genreId}`);

        it('should return 404 if object ID is not valid', async () => {
            genreId = 1;
            const res = await exec().send({});

            expect(res.status).toBe(404);
        });

        it('should return 404 if object ID of genre does not exist', async () => {
            genreId = mongoose.Types.ObjectId();
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

        it('should return 400 if name is more than 50 characters', async () => {
            const name = new Array(52).join('a');
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

        it('should return 200, and update the genre if request is valid', async () => {
            const res = await exec().send({
                name: 'qwe',
                description: 'qwe test'
            });

            const genreInDb = await Genre.findById(genreId);

            expect(res.status).toBe(200);
            expect(genreInDb.name).toBe('qwe');
            expect(genreInDb.description).toBe('qwe test');
            expect(genreInDb.updatedAt).not.toBeNull();
        });

        it('should return 200, and return the updated genre if request is valid', async () => {
            const res = await exec().send({
                name: 'qwe',
                description: 'qwe test'
            });

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveProperty('_id', genreId.toHexString());
            expect(res.body.data).toHaveProperty('name', 'qwe');
            expect(res.body.data).toHaveProperty('description', 'qwe test');
            expect(res.body.data).toHaveProperty('updatedAt');
        });
    });

    describe('DELETE /api/v1/genres/:id', () => {
        let genre;
        let genreId;

        beforeEach(async () => {
            genre = await Genre.create({
                name: 'Action',
                description: 'Fighting scenes'
            });

            genreId = genre._id;
        });
        afterEach(async () => {
            await genre.remove();
        });

        const exec = () => request(server).delete(`/api/v1/genres/${genreId}`);

        it('should return 404 if object ID is not valid', async () => {
            genreId = 1;
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 404 if object ID of genre does not exist', async () => {
            genreId = mongoose.Types.ObjectId();
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 200, and delete the genre if request is valid', async () => {
            const res = await exec();

            const genreInDb = await Genre.findById(genreId);

            expect(res.status).toBe(200);
            expect(genreInDb).toBeNull();
        });

        it('should return 200, and return the deleted genre if request is valid', async () => {
            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveProperty('_id', genreId.toHexString());
            expect(res.body.data).toHaveProperty('name', 'Action');
            expect(res.body.data).toHaveProperty(
                'description',
                'Fighting scenes'
            );
        });
    });
});
