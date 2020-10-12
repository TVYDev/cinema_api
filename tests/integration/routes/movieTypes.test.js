const request = require('supertest');
const mongoose = require('mongoose');
const { MovieType } = require('../../../models/MovieType');

let server;

describe('Movie Types', () => {
    beforeAll(() => {
        server = require('../../../server');
    });
    afterAll(async () => {
        await server.close();
    });
    afterEach(async () => {
        await MovieType.deleteMany();
    });

    describe('/GET /api/v1/movie-types', () => {
        it('should return 200, and return all the movie types if the request is valid', async () => {
            await MovieType.create([
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

            const res = await request(server).get('/api/v1/movie-types');
            const { items } = res.body.data;

            expect(res.status).toBe(200);
            expect(items.some((m) => m.name === '2D')).toBeTruthy();
            expect(items.some((m) => m.name === '3D')).toBeTruthy();
            expect(
                items.some((m) => m.description === 'Simple 2D technology')
            ).toBeTruthy();
            expect(
                items.some(
                    (m) =>
                        m.description ===
                        'Exciting 3D technology with surrounding sounds'
                )
            ).toBeTruthy();
            expect(items).toHaveLength(2);
        });
    });

    describe('POST /api/v1/movie-types', () => {
        const data = {
            name: '2D',
            description: 'Simple 2D technology'
        };

        const exec = () => request(server).post('/api/v1/movie-types');

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

        it('should return 400 if name is duplicated', async () => {
            const res1 = await exec().send(data);
            const res2 = await exec().send(data);

            expect(res1.status).toBe(201);
            expect(res2.status).toBe(400);
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

        it('should return 201, and save the movie type if the request is valid', async () => {
            const res = await exec().send(data);

            const movieTypeInDb = await MovieType.find({ name: '2D' });

            expect(res.status).toBe(201);
            expect(movieTypeInDb).not.toBeNull();
        });

        it('should return 201, and return the created movie type if the request is valid', async () => {
            const res = await exec().send(data);

            expect(res.status).toBe(201);
            expect(res.body.data).toHaveProperty('name', '2D');
            expect(res.body.data).toHaveProperty(
                'description',
                'Simple 2D technology'
            );
            expect(res.body.data).toHaveProperty('createdAt');
        });
    });
});
