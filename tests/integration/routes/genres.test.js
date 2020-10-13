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
});
