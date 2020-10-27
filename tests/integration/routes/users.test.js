const request = require('supertest');
const mongoose = require('mongoose');
const { User } = require('../../../models/User');
const { Membership } = require('../../../models/Membership');
let server;

describe('Users', () => {
    beforeAll(() => {
        server = require('../../../server');
    });
    afterAll(async () => {
        await server.close();
    });
    afterEach(async () => {
        await User.deleteMany();
    });

    describe('POST /api/v1/users', () => {
        let membership;

        const data = {
            name: 'qwe',
            email: 'qwe@mail.com',
            role: 'customer',
            password: '123456'
        };

        beforeEach(async () => {
            membership = await Membership.create({
                name: 'Silver',
                description: 'Free drinks every purchase'
            });

            data.membershipId = membership._id;
        });

        afterEach(async () => {
            await membership.remove();
        });

        const exec = () => request(server).post('/api/v1/users');

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

        it('should return 400 if name is duplicated', async () => {
            const res1 = await exec().send(data);
            const res2 = await exec().send(data);

            expect(res1.status).toBe(201);
            expect(res2.status).toBe(400);
        });

        it('should return 400 if email is not provided', async () => {
            const curData = { ...data };
            delete curData.email;

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if email is not a string', async () => {
            const curData = { ...data };
            curData.email = true;

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if email is an empty string', async () => {
            const curData = { ...data };
            curData.email = '';

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if email is duplicated', async () => {
            const res1 = await exec().send(data);
            const res2 = await exec().send(data);

            expect(res1.status).toBe(201);
            expect(res2.status).toBe(400);
        });

        it('should return 400 if role is not provided', async () => {
            const curData = { ...data };
            delete curData.role;

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if role is not a string', async () => {
            const curData = { ...data };
            curData.role = true;

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if role is an empty string', async () => {
            const curData = { ...data };
            curData.role = '';

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if role is not customer or staff', async () => {
            const curData = { ...data };
            curData.role = 'admin';

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if password is not provided', async () => {
            const curData = { ...data };
            delete curData.password;

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if password is not a string', async () => {
            const curData = { ...data };
            curData.password = true;

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if password is an empty string', async () => {
            const curData = { ...data };
            curData.password = '';

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if password is less than 6 characters', async () => {
            const curData = { ...data };
            curData.password = '12345';

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if role is customer and membershipId is not provided', async () => {
            const curData = { ...data };
            delete curData.membershipId;

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if role is not customer but membershipId is provided', async () => {
            const curData = { ...data };
            curData.role = 'staff';

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if membershipId is not a valid object Id', async () => {
            const curData = { ...data };
            curData.membershipId = 1;

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 404 if membershipId does not exist', async () => {
            const curData = { ...data };
            curData.membershipId = mongoose.Types.ObjectId();

            const res = await exec().send(curData);

            expect(res.status).toBe(404);
        });

        it('should return 201, and create the user if request is valid', async () => {
            const res = await exec().send(data);

            const userInDb = await User.findOne({ name: 'qwe' });

            expect(res.status).toBe(201);
            expect(userInDb).not.toBeNull();
            expect(userInDb.name).toBe('qwe');
        });

        it('should return 201, and return the created user if request is valid', async () => {
            const res = await exec().send(data);
            const { data: dt } = res.body;

            expect(res.status).toBe(201);
            expect(dt).toHaveProperty('name', 'qwe');
            expect(dt).toHaveProperty('email', 'qwe@mail.com');
            expect(dt).toHaveProperty('role', 'customer');
            expect(dt).toHaveProperty(
                'membership',
                membership._id.toHexString()
            );
            expect(dt).toHaveProperty('createdAt');
            expect(dt).not.toHaveProperty('password');
        });
    });

    describe('PUT /api/v1/users/:id', () => {
        let user;
        let userId;
        let membership;

        beforeEach(async () => {
            membership = await Membership.create({
                name: 'Silver',
                description: 'Free drinks every purchase'
            });

            user = await User.create({
                name: 'qwe',
                email: 'qwe@mail.com',
                role: 'customer',
                membership: mongoose.Types.ObjectId(),
                password: '123456'
            });

            userId = user._id;
        });

        afterEach(async () => {
            await membership.remove();
        });

        const exec = () => request(server).put(`/api/v1/users/${userId}`);

        it('should return 404 if object ID of user is not valid', async () => {
            userId = 1;

            const res = await exec().send({});

            expect(res.status).toBe(404);
        });

        it('should return 404 if object ID of user does not exist', async () => {
            userId = mongoose.Types.ObjectId();

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

        it('should return 400 if name is duplicated', async () => {
            await User.create({
                name: 'Phonee Dellee',
                email: 'phonee@mail.com',
                role: 'staff',
                password: '123456'
            });

            const res = await exec().send({ name: 'Phonee Dellee' });

            expect(res.status).toBe(400);
        });

        it('should return 400 if email is not a string', async () => {
            const res = await exec().send({ email: true });

            expect(res.status).toBe(400);
        });

        it('should return 400 if email is an empty string', async () => {
            const res = await exec().send({ email: '' });

            expect(res.status).toBe(400);
        });

        it('should return 400 if email is duplicated', async () => {
            await User.create({
                name: 'Phonee Dellee',
                email: 'phonee@mail.com',
                role: 'staff',
                password: '123456'
            });

            const res = await exec().send({ email: 'phonee@mail.com' });

            expect(res.status).toBe(400);
        });

        it('should return 400 if role is not a string', async () => {
            const res = await exec().send({ role: true });

            expect(res.status).toBe(400);
        });

        it('should return 400 if role is an empty string', async () => {
            const res = await exec().send({ role: '' });

            expect(res.status).toBe(400);
        });

        it('should return 400 if role is not customer or staff', async () => {
            const res = await exec().send({ role: 'admin' });

            expect(res.status).toBe(400);
        });

        it('should return 400 if membershipId is not a valid object Id', async () => {
            const res = await exec().send({ membershipId: 1 });

            expect(res.status).toBe(400);
        });

        it('should return 404 if membershipId does not exist', async () => {
            const res = await exec().send({
                membershipId: mongoose.Types.ObjectId()
            });

            expect(res.status).toBe(404);
        });

        it('should return 200, and update the user if request is valid', async () => {
            const res = await exec().send({
                name: 'asd',
                email: 'asd@mail.com',
                role: 'staff',
                membershipId: membership._id
            });

            const userInDb = await User.findById(userId);

            expect(res.status).toBe(200);
            expect(userInDb.name).toBe('asd');
            expect(userInDb.email).toBe('asd@mail.com');
            expect(userInDb.role).toBe('staff');
            expect(userInDb.membership.toHexString()).toBe(
                membership._id.toHexString()
            );
        });

        it('should return 200, and return the updated user if request is valid', async () => {
            const res = await exec().send({
                name: 'asd',
                email: 'asd@mail.com',
                role: 'staff',
                membershipId: membership._id
            });

            const { data: dt } = res.body;

            expect(res.status).toBe(200);
            expect(dt).toHaveProperty('_id', userId.toHexString());
            expect(dt).toHaveProperty('name', 'asd');
            expect(dt).toHaveProperty('email', 'asd@mail.com');
            expect(dt).toHaveProperty('role', 'staff');
            expect(dt).toHaveProperty('membership');
            expect(dt).toHaveProperty('updatedAt');
        });
    });
});
