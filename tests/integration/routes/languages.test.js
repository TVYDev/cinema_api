const request = require('supertest');
const mongoose = require('mongoose');
const { Language } = require('../../../models/Language');
let server;

describe('Languages', () => {
    beforeAll(() => {
        server = require('../../../server');
    });
    afterAll(async () => {
        await server.close();
    });
    afterEach(async () => {
        await Language.deleteMany();
    });

    describe('GET /api/v1/languages', () => {
        it('should return 200, and return all the langauges if request is valid', async () => {
            await Language.create([
                {
                    name: 'Khmer'
                },
                {
                    name: 'English'
                }
            ]);

            const res = await request(server).get('/api/v1/languages');
            const { items } = res.body.data;

            expect(res.status).toBe(200);
            expect(items.some((l) => l.name === 'Khmer')).toBeTruthy();
            expect(items.some((l) => l.name === 'English')).toBeTruthy();
            expect(items).toHaveLength(2);
        });
    });

    describe('GET /api/v1/languages/:id', () => {
        let language;
        let languageId;

        beforeEach(async () => {
            language = await Language.create({ name: 'Khmer' });

            languageId = language._id;
        });
        afterEach(async () => {
            await language.remove();
        });

        const exec = () =>
            request(server).get(`/api/v1/languages/${languageId}`);

        it('should return 404 if object ID is not valid', async () => {
            languageId = 1;
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 404 if object ID of langauge does not exist', async () => {
            languageId = mongoose.Types.ObjectId();
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 200, and return the language if object ID is valid and exist', async () => {
            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveProperty(
                '_id',
                languageId.toHexString()
            );
            expect(res.body.data).toHaveProperty('name', 'Khmer');
            expect(res.body.data).toHaveProperty('createdAt');
        });
    });

    describe('POST /api/v1/languages', () => {
        const exec = () => request(server).post('/api/v1/languages');

        it('should return 400 if name is not provided', async () => {
            const res = await exec().send({});

            expect(res.status).toBe(400);
        });

        it('should return 400 if name is not a string', async () => {
            const res = await exec().send({ name: 1 });

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

        it('should return 400 if name is duplicated', async () => {
            const res1 = await exec().send({ name: 'Khmer' });
            const res2 = await exec().send({ name: 'Khmer' });

            expect(res1.status).toBe(201);
            expect(res2.status).toBe(400);
        });

        it('should return 201, and create the language if request is valid', async () => {
            const res = await exec().send({ name: 'Khmer' });

            const languageInDb = await Language.find({ name: 'Khmer' });

            expect(res.status).toBe(201);
            expect(languageInDb).not.toBeNull();
        });

        it('should return 201, and return the created langauge if request is valid', async () => {
            const res = await exec().send({ name: 'Khmer' });

            expect(res.status).toBe(201);
            expect(res.body.data).toHaveProperty('_id');
            expect(res.body.data).toHaveProperty('name', 'Khmer');
            expect(res.body.data).toHaveProperty('createdAt');
        });
    });

    describe('PUT /api/v1/languages/:id', () => {
        let language;
        let languageId;

        beforeEach(async () => {
            language = await Language.create({ name: 'Khmer' });

            languageId = language._id;
        });
        afterEach(async () => {
            await language.remove();
        });

        const exec = () =>
            request(server).put(`/api/v1/languages/${languageId}`);

        it('should return 404 if object ID is not valid', async () => {
            languageId = 1;
            const res = await exec().send({});

            expect(res.status).toBe(404);
        });

        it('should return 404 if object ID of langauge does not exist', async () => {
            languageId = mongoose.Types.ObjectId();
            const res = await exec().send({});

            expect(res.status).toBe(404);
        });

        it('should return 400 if name is not a string', async () => {
            const res = await exec().send({ name: 1 });

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

        it('should return 400 if name is duplicated', async () => {
            await Language.create({ name: 'English' });

            const res = await exec().send({ name: 'English' });

            expect(res.status).toBe(400);
        });

        it('should return 200, and update the language if request is valid', async () => {
            const res = await exec().send({ name: 'qwe' });

            const languageInDb = await Language.findById(languageId);

            expect(res.status).toBe(200);
            expect(languageInDb.name).toBe('qwe');
            expect(languageInDb.updatedAt).not.toBeNull();
        });

        it('should return 200, and return the updated language if request is valid', async () => {
            const res = await exec().send({ name: 'qwe' });

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveProperty(
                '_id',
                languageId.toHexString()
            );
            expect(res.body.data).toHaveProperty('name', 'qwe');
            expect(res.body.data).toHaveProperty('updatedAt');
        });
    });

    describe('DELETE /api/v1/languages/:id', () => {
        let language;
        let languageId;

        beforeEach(async () => {
            language = await Language.create({ name: 'Khmer' });

            languageId = language._id;
        });
        afterEach(async () => {
            await language.remove();
        });

        const exec = () =>
            request(server).delete(`/api/v1/languages/${languageId}`);

        it('should return 404 if object ID is not valid', async () => {
            languageId = 1;
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 404 if object ID of langauge does not exist', async () => {
            languageId = mongoose.Types.ObjectId();
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 200, and delete the language if object ID is valid and exists', async () => {
            const res = await exec();

            const languageInDb = await Language.findById(languageId);

            expect(res.status).toBe(200);
            expect(languageInDb).toBeNull();
        });

        it('should return 200, and return the deleted language if object ID is valid and exists', async () => {
            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveProperty(
                '_id',
                languageId.toHexString()
            );
            expect(res.body.data).toHaveProperty('name', 'Khmer');
        });
    });
});
