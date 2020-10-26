const mongoose = require('mongoose');
const request = require('supertest');
const { Membership } = require('../../../models/Membership');
let server;

describe('Memberships', () => {
    beforeAll(() => {
        server = require('../../../server');
    });
    afterAll(async () => {
        await server.close();
    });
    afterEach(async () => {
        await Membership.deleteMany();
    });

    describe('GET /api/v1/memberships', () => {
        it('should return 200, and return all the memberships', async () => {
            await Membership.create([
                {
                    name: 'Silver',
                    description: 'Free drinks every purchase'
                },
                {
                    name: 'Platinum',
                    description: 'Free Thursday two tickets'
                }
            ]);

            const res = await request(server).get('/api/v1/memberships');
            const { items } = res.body.data;

            expect(res.status).toBe(200);
            expect(items.some((m) => m.name === 'Silver')).toBeTruthy();
            expect(items.some((m) => m.name === 'Platinum')).toBeTruthy();
            expect(
                items.some(
                    (m) => m.description === 'Free drinks every purchase'
                )
            ).toBeTruthy();
            expect(
                items.some((m) => m.description === 'Free Thursday two tickets')
            ).toBeTruthy();
            expect(items).toHaveLength(2);
        });
    });

    describe('GET /api/v1/memberships/:id', () => {
        let membership;
        let membershipId;

        beforeEach(async () => {
            membership = await Membership.create({
                name: 'Silver',
                description: 'Free drinks every purchase'
            });

            membershipId = membership._id;
        });

        const exec = () =>
            request(server).get(`/api/v1/memberships/${membershipId}`);

        it('should return 404 if object ID is not valid', async () => {
            membershipId = 1;
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 404 if object ID of membership does not exist', async () => {
            membershipId = mongoose.Types.ObjectId();
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 200, and return the membership if object ID is valid and exists', async () => {
            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveProperty(
                '_id',
                membershipId.toHexString()
            );
            expect(res.body.data).toHaveProperty('name', 'Silver');
            expect(res.body.data).toHaveProperty(
                'description',
                'Free drinks every purchase'
            );
            expect(res.body.data).toHaveProperty('createdAt');
        });
    });

    describe('POST /api/v1/memberships', () => {
        const data = {
            name: 'Silver',
            description: 'With exclusive discount'
        };

        const exec = () => request(server).post('/api/v1/memberships');

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
            curData.name = new Array(52).join('a');

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

        it('should return 400 if name is duplicated', async () => {
            const res1 = await exec().send(data);
            const res2 = await exec().send(data);

            expect(res1.status).toBe(201);
            expect(res2.status).toBe(400);
        });

        it('should return 201, and created membership if request is valid', async () => {
            const res = await exec().send(data);

            const membershipInDb = await Membership.findOne({ name: 'Silver' });

            expect(res.status).toBe(201);
            expect(membershipInDb).not.toBeNull();
        });

        it('should return 201, and return the created membership if request is valid', async () => {
            const res = await exec().send(data);

            expect(res.status).toBe(201);
            expect(res.body.data).toHaveProperty('_id');
            expect(res.body.data).toHaveProperty('name', 'Silver');
            expect(res.body.data).toHaveProperty(
                'description',
                'With exclusive discount'
            );
            expect(res.body.data).toHaveProperty('createdAt');
        });
    });

    describe('PUT /api/v1/memberships/:id', () => {
        let membership;
        let membershipId;

        beforeEach(async () => {
            membership = await Membership.create({
                name: 'Silver',
                description: 'Free drinks every purchase'
            });

            membershipId = membership._id;
        });

        const exec = () =>
            request(server).put(`/api/v1/memberships/${membershipId}`);

        it('should return 404 if object ID is not valid', async () => {
            membershipId = 1;
            const res = await exec().send({});

            expect(res.status).toBe(404);
        });

        it('should return 404 if object ID of membership does not exist', async () => {
            membershipId = mongoose.Types.ObjectId();
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

        it('should return 400 if name is duplicated', async () => {
            await Membership.create({
                name: 'Platinum',
                description: 'Free Thursday two tickets'
            });
            const res = await exec().send({ name: 'Platinum' });

            expect(res.status).toBe(400);
        });

        it('should return 200, and update the membership if request is valid', async () => {
            const res = await exec().send({
                name: 'qwe',
                description: 'qwe test'
            });

            const membershipInDb = await Membership.findById(membershipId);

            expect(res.status).toBe(200);
            expect(membershipInDb.name).toBe('qwe');
            expect(membershipInDb.description).toBe('qwe test');
            expect(membershipInDb.updatedAt).not.toBeNull();
        });

        it('should return 200, and return the updated membership if request is valid', async () => {
            const res = await exec().send({
                name: 'qwe',
                description: 'qwe test'
            });

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveProperty(
                '_id',
                membershipId.toHexString()
            );
            expect(res.body.data).toHaveProperty('name', 'qwe');
            expect(res.body.data).toHaveProperty('description', 'qwe test');
            expect(res.body.data).toHaveProperty('updatedAt');
        });
    });

    describe('DELETE /api/v1/memberships/:id', () => {
        let membership;
        let membershipId;

        beforeEach(async () => {
            membership = await Membership.create({
                name: 'Silver',
                description: 'Free drinks every purchase'
            });

            membershipId = membership._id;
        });

        const exec = () =>
            request(server).delete(`/api/v1/memberships/${membershipId}`);

        it('should return 404 if object ID is not valid', async () => {
            membershipId = 1;
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 404 if object ID of membership does not exist', async () => {
            membershipId = mongoose.Types.ObjectId();
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 200, and delete the membership if request is valid', async () => {
            const res = await exec();

            const membershipInDb = await Membership.findById(membershipId);

            expect(res.status).toBe(200);
            expect(membershipInDb).toBeNull();
        });

        it('should return 200, and return the deleted membership if request is valid', async () => {
            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveProperty(
                '_id',
                membershipId.toHexString()
            );
        });
    });
});
