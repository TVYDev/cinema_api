const request = require('supertest');
const mongoose = require('mongoose');
const { Purchase } = require('../../../models/Purchase');
const { Showtime } = require('../../../models/Showtime');
const { Movie } = require('../../../models/Movie');
const { Hall } = require('../../../models/Hall');
const { Setting } = require('../../../models/Setting');
let server;

describe('Purchases', () => {
    beforeAll(async () => {
        server = require('../../../server');

        await Setting.create([
            {
                key: 'min_minutes_interval_showtime',
                value: 30,
                type: 'number'
            },
            {
                key: 'amount_minutes_seat_selection',
                value: 10,
                type: 'number'
            },
            {
                key: 'max_number_tickets_per_purchase',
                value: 10,
                type: 'number'
            }
        ]);
    });
    afterAll(async () => {
        await server.close();
        await Setting.deleteMany();
    });
    afterEach(async () => {
        await Purchase.deleteMany();
    });

    describe('POST /api/v1/purchase/initiate', () => {
        let showtime;
        let movie;
        let hall;

        const data = {
            numberTickets: 2
        };

        beforeEach(async () => {
            movie = await Movie.create({
                title: 'Spider man',
                description: 'Superhero with climbing abilities',
                releasedDate: '2020-01-23',
                ticketPrice: 2.5,
                durationInMinutes: 120,
                genres: [mongoose.Types.ObjectId()],
                movieType: mongoose.Types.ObjectId(),
                trailerUrl: 'https://youtu.be/dR3cjXncoSk',
                posterUrl:
                    'https://i.pinimg.com/originals/e6/a2/5a/e6a25a2855e741f7461fe1698db3153a.jpg',
                spokenLanguage: mongoose.Types.ObjectId(),
                subtitleLanguage: mongoose.Types.ObjectId(),
                country: mongoose.Types.ObjectId()
            });

            hall = await Hall.create({
                name: 'Hall One',
                seatRows: ['A', 'B', 'C', 'D'],
                seatColumns: [1, 2, 3, 4],
                cinema: mongoose.Types.ObjectId(),
                hallType: mongoose.Types.ObjectId()
            });

            showtime = await Showtime.create({
                startedDateTime: '2023-10-20 17:00',
                movie: movie._id,
                hall: hall._id
            });

            data.showtimeId = showtime._id;
        });

        afterEach(async () => {
            await Showtime.deleteMany();
            await Movie.deleteMany();
            await Hall.deleteMany();
        });

        const exec = () => request(server).post('/api/v1/purchases/initiate');

        it('should return 400 if numberTickets is not provided', async () => {
            const curData = { ...data };
            delete curData.numberTickets;

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if numberTickets is not a number', async () => {
            const curData = { ...data };
            curData.numberTickets = true;

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if numberTickets is less than 1', async () => {
            const curData = { ...data };
            curData.numberTickets = 0;

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if numberTickets exceeds maximum of 10 seats per ticket', async () => {
            const curData = { ...data };
            curData.numberTickets = 11;

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if showtimeId is not provided', async () => {
            const curData = { ...data };
            delete curData.showtimeId;

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if showtimeId is not a valid object ID', async () => {
            const curData = { ...data };
            curData.showtimeId = 1;

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 404 if showtimeID does not exist', async () => {
            const curData = { ...data };
            curData.showtimeId = mongoose.Types.ObjectId();

            const res = await exec().send(curData);

            expect(res.status).toBe(404);
        });

        it('should return 400 if tickets are not enough', async () => {
            const curData = { ...data };
            curData.numberTickets = 10;

            const res1 = await exec().send(curData);
            const res2 = await exec().send(curData);

            expect(res1.status).toBe(201);
            expect(res2.status).toBe(400);
        });

        it('should return 201, and initiate the purchase if request is valid', async () => {
            const res = await exec().send(data);

            const purchaseInDb = await Purchase.find({
                showtime: showtime._id
            });

            expect(res.status).toBe(201);
            expect(purchaseInDb).not.toBeNull();
        });

        it('should return 201, and return the initiated purchase if request is valid', async () => {
            const res = await exec().send(data);
            const { data: dt } = res.body;

            expect(res.status).toBe(201);
            expect(dt).toHaveProperty('_id');
            expect(dt).toHaveProperty('showtime');
            expect(dt).toHaveProperty('numberTickets', 2);
            expect(dt).toHaveProperty('originalAmount', 5);
            expect(dt).toHaveProperty('status', 'initiated');
            expect(dt).toHaveProperty('expiredSeatSelectionAt');
            expect(dt).toHaveProperty('createdAt');
            expect(dt).toHaveProperty('chosenSeats');

            expect(dt.chosenSeats).toHaveLength(2);
        });
    });
});
