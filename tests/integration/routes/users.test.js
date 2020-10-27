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
});
