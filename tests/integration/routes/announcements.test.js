const mongoose = require('mongoose');
const request = require('supertest');
const { Announcement } = require('../../../models/Announcement');
let server;

describe('Announcements', () => {
    beforeAll(() => {
        server = require('../../../server');
    });
    afterAll(async () => {
        await server.close();
    });
    afterEach(async () => {
        await Announcement.deleteMany();
    });

    describe('GET /api/v1/announcements', () => {
        it('should return 200, and return all the announcements if request is valid', async () => {
            await Announcement.create([
                {
                    title: 'Free Free',
                    description: 'Buy Ticket, Free Popcorn',
                    startedDateTime: '2023-10-10 10:00',
                    endedDateTime: '2023-12-12 10:00'
                },
                {
                    title: 'Discount 20%',
                    description: 'Buy Ticket, Discount Popcorn 20%',
                    startedDateTime: '2023-05-01 06:00',
                    endedDateTime: '2023-06-01 10:00'
                }
            ]);

            const res = await request(server).get('/api/v1/announcements');
            const { items } = res.body.data;

            expect(res.status).toBe(200);
            expect(items.some((a) => a.title === 'Free Free')).toBeTruthy();
            expect(items.some((a) => a.title === 'Discount 20%')).toBeTruthy();
            expect(
                items.some((a) => a.description === 'Buy Ticket, Free Popcorn')
            ).toBeTruthy();
            expect(
                items.some(
                    (a) => a.description === 'Buy Ticket, Discount Popcorn 20%'
                )
            );
            expect(items).toHaveLength(2);
        });
    });

    describe('GET /api/v1/announcements/:id', () => {
        let announcement;
        let announcementId;

        beforeEach(async () => {
            announcement = await Announcement.create({
                title: 'Free Free',
                description: 'Buy Ticket, Free Popcorn',
                startedDateTime: '2023-10-10 10:00',
                endedDateTime: '2023-12-12 10:00'
            });

            announcementId = announcement._id;
        });

        const exec = () =>
            request(server).get(`/api/v1/announcements/${announcementId}`);

        it('should return 404 if object ID of announcement is not valid', async () => {
            announcementId = 1;
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 404 if object ID of announcement does not exist', async () => {
            announcementId = mongoose.Types.ObjectId();
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 200, and return the announcement if object ID is valid and exists', async () => {
            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveProperty(
                '_id',
                announcementId.toHexString()
            );
            expect(res.body.data).toHaveProperty('title', 'Free Free');
            expect(res.body.data).toHaveProperty(
                'description',
                'Buy Ticket, Free Popcorn'
            );
            expect(res.body.data).toHaveProperty('startedDateTime');
            expect(res.body.data).toHaveProperty('endedDateTime');
            expect(res.body.data).toHaveProperty('createdAt');
        });
    });

    describe('POST /api/v1/announcements', () => {
        const data = {
            title: 'Free Free',
            description: 'Buy ticket, Free Popcorn',
            startedDateTime: '2021-06-23 10:00',
            endedDateTime: '2021-07-10 06:00'
        };

        const exec = () => request(server).post('/api/v1/announcements');

        it('should return 400 if title is not provided', async () => {
            const curData = { ...data };
            delete curData.title;

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if title is not a string', async () => {
            const curData = { ...data };
            curData.title = true;

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if title is an empty string', async () => {
            const curData = { ...data };
            curData.title = '';

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if title is more than 250 characters', async () => {
            const curData = { ...data };
            const title = new Array(252).join('a');
            curData.title = title;

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

        it('should return 400 if startedDateTime is not a string', async () => {
            const curData = { ...data };
            curData.startedDateTime = true;

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if startedDateTime is an empty string', async () => {
            const curData = { ...data };
            curData.startedDateTime = '';

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if startedDateTime is not a valid IOS date', async () => {
            const curData = { ...data };
            curData.startedDateTime = '2020-20-20 10:00';

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if startedDateTime is before now', async () => {
            const curData = { ...data };
            curData.startedDateTime = '2020-02-02 10:00';

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if endedDateTime is not a string', async () => {
            const curData = { ...data };
            curData.endedDateTime = true;

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if endedDateTime is an empty string', async () => {
            const curData = { ...data };
            curData.endedDateTime = '';

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if endedDateTime is not a valid IOS date', async () => {
            const curData = { ...data };
            curData.endedDateTime = '2020-20-20 10:00';

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if endedDateTime is before now', async () => {
            const curData = { ...data };
            curData.endedDateTime = '2020-02-02 10:00';

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if startedDateTime is after endedDateTime', async () => {
            const curData = { ...data };
            curData.startedDateTime = '2023-10-10 10:00';
            curData.endedDateTime = '2023-10-10 09:00';

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 201, and create the announcement if request is valid', async () => {
            const res = await exec().send(data);

            const announcementInDb = await Announcement.find({
                title: 'Free Free',
                description: 'Buy ticket, Free Popcorn'
            });

            expect(res.status).toBe(201);
            expect(announcementInDb).not.toBeNull();
            expect(announcementInDb.indexPosition).not.toBeNull();
        });

        it('should return 201, and set indexPosition correctly if request is valid', async () => {
            const res1 = await exec().send(data);
            const res2 = await exec().send(data);

            expect(res1.status).toBe(201);
            expect(res2.status).toBe(201);

            expect(res1.body.data).toHaveProperty('indexPosition', 0);
            expect(res2.body.data).toHaveProperty('indexPosition', 1);
        });

        it('should return 201, and set startedDateTime to now if startedDateTime is not provided', async () => {
            const curData = { ...data };
            delete curData.startedDateTime;

            const res = await exec().send(curData);

            expect(res.status).toBe(201);
            expect(res.body.data).toHaveProperty('startedDateTime');
        });

        it('should return 201, and return the created announcement if request is valid', async () => {
            const res = await exec().send(data);
            const { data: dt } = res.body;

            expect(res.status).toBe(201);
            expect(dt).toHaveProperty('_id');
            expect(dt).toHaveProperty('title', 'Free Free');
            expect(dt).toHaveProperty(
                'description',
                'Buy ticket, Free Popcorn'
            );
            expect(dt).toHaveProperty('startedDateTime');
            expect(new Date(dt.startedDateTime).toISOString()).toBe(
                new Date('2021-06-23 10:00').toISOString()
            );
            expect(dt).toHaveProperty('endedDateTime');
            expect(new Date(dt.endedDateTime).toISOString()).toBe(
                new Date('2021-07-10 06:00').toISOString()
            );
            expect(dt).toHaveProperty('indexPosition', 0);
        });
    });

    describe('PUT /api/v1/announcements/:id', () => {
        let announcement;
        let announcementId;

        beforeEach(async () => {
            announcement = await Announcement.create({
                title: 'Free Free',
                description: 'Buy Ticket, Free Popcorn',
                startedDateTime: '2023-10-10 10:00',
                endedDateTime: '2023-12-12 10:00'
            });

            announcementId = announcement._id;
        });

        const exec = () =>
            request(server).put(`/api/v1/announcements/${announcementId}`);

        it('should return 404 if object ID of announcement is not valid', async () => {
            announcementId = 1;
            const res = await exec().send({});

            expect(res.status).toBe(404);
        });

        it('should return 404 if object ID of announcement does not exist', async () => {
            announcementId = mongoose.Types.ObjectId();
            const res = await exec().send({});

            expect(res.status).toBe(404);
        });

        it('should return 400 if title is not a string', async () => {
            const res = await exec().send({ title: true });

            expect(res.status).toBe(400);
        });

        it('should return 400 if title is an empty string', async () => {
            const res = await exec().send({ title: '' });

            expect(res.status).toBe(400);
        });

        it('should return 400 if title is more than 250 characters', async () => {
            const title = new Array(252).join('a');
            const res = await exec().send({ title });

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

        it('should return 400 if startedDateTime is not a string', async () => {
            const res = await exec().send({ startedDateTime: true });

            expect(res.status).toBe(400);
        });

        it('should return 400 if startedDateTime is an empty string', async () => {
            const res = await exec().send({ startedDateTime: '' });

            expect(res.status).toBe(400);
        });

        it('should return 400 if startedDateTime is not a valid IOS date', async () => {
            const res = await exec().send({
                startedDateTime: '2020-20-20 10:00'
            });

            expect(res.status).toBe(400);
        });

        it('should return 400 if startedDateTime is before now', async () => {
            const res = await exec().send({
                startedDateTime: '2020-02-02 10:00'
            });

            expect(res.status).toBe(400);
        });

        it('should return 400 if endedDateTime is not a string', async () => {
            const res = await exec().send({ endedDateTime: true });

            expect(res.status).toBe(400);
        });

        it('should return 400 if endedDateTime is an empty string', async () => {
            const res = await exec().send({ endedDateTime: '' });

            expect(res.status).toBe(400);
        });

        it('should return 400 if endedDateTime is not a valid IOS date', async () => {
            const res = await exec().send({
                endedDateTime: '2020-20-20 10:00'
            });

            expect(res.status).toBe(400);
        });

        it('should return 400 if endedDateTime is before now', async () => {
            const res = await exec().send({
                endedDateTime: '2020-02-02 10:00'
            });

            expect(res.status).toBe(400);
        });

        it('should return 400 if startedDateTime is after endedDateTime', async () => {
            const res = await exec().send({
                startedDateTime: '2023-10-10 10:00',
                endedDateTime: '2023-10-10 09:00'
            });

            expect(res.status).toBe(400);
        });

        it('should return 400 if input startedDateTime is greater than the endedDateTime', async () => {
            const res = await exec().send({
                startedDateTime: '2024-12-12 10:00'
            });

            expect(res.status).toBe(400);
        });

        it('should return 400 if input endedDateTime is less than the startedDateTime', async () => {
            const res = await exec().send({
                endedDateTime: '2022-10-10 10:00'
            });

            expect(res.status).toBe(400);
        });

        it('should return 200, and update the announcement if request is valid', async () => {
            const res = await exec().send({
                title: 'qwe',
                description: 'qweqwe',
                startedDateTime: '2023-01-23 10:10',
                endedDateTime: '2024-01-23 10:10'
            });

            const announcementInDb = await Announcement.findById(
                announcementId
            );

            expect(res.status).toBe(200);
            expect(announcementInDb.title).toBe('qwe');
            expect(announcementInDb.description).toBe('qweqwe');
            expect(
                new Date(announcementInDb.startedDateTime).toISOString()
            ).toBe(new Date('2023-01-23 10:10').toISOString());
            expect(new Date(announcementInDb.endedDateTime).toISOString()).toBe(
                new Date('2024-01-23 10:10').toISOString()
            );
            expect(announcementInDb.updatedAt).not.toBeNull();
        });

        it('should return 200, and return the updated announcement if request is valid', async () => {
            const res = await exec().send({
                title: 'qwe',
                description: 'qweqwe',
                startedDateTime: '2023-01-23 10:10',
                endedDateTime: '2024-01-23 10:10'
            });

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveProperty(
                '_id',
                announcementId.toHexString()
            );
            expect(res.body.data).toHaveProperty('title', 'qwe');
            expect(res.body.data).toHaveProperty('description', 'qweqwe');
            expect(res.body.data).toHaveProperty('startedDateTime');
            expect(res.body.data).toHaveProperty('endedDateTime');
            expect(res.body.data).toHaveProperty('updatedAt');
        });
    });

    describe('DELETE /api/v1/announcements/:id', () => {
        let announcement;
        let announcementId;

        beforeEach(async () => {
            announcement = await Announcement.create({
                title: 'Free Free',
                description: 'Buy Ticket, Free Popcorn',
                startedDateTime: '2023-10-10 10:00',
                endedDateTime: '2023-12-12 10:00'
            });

            announcementId = announcement._id;
        });

        const exec = () =>
            request(server).delete(`/api/v1/announcements/${announcementId}`);

        it('should return 404 if object ID of announcement is not valid', async () => {
            announcementId = 1;
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 404 if object ID of announcement does not exist', async () => {
            announcementId = mongoose.Types.ObjectId();
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 200, and delete the announcement if object ID is valid and exists', async () => {
            const res = await exec();

            const announcementInDb = await Announcement.findById(
                announcementId
            );

            expect(res.status).toBe(200);
            expect(announcementInDb).toBeNull();
        });

        it('should return 200, and return the deleted announcement if object ID is valid and exists', async () => {
            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveProperty(
                '_id',
                announcementId.toHexString()
            );
            expect(res.body.data).toHaveProperty('title', 'Free Free');
        });
    });
});
