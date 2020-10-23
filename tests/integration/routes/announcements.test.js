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
});
