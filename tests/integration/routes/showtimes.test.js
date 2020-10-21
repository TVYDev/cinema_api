const request = require('supertest');
const mongoose = require('mongoose');
const { Showtime } = require('../../../models/Showtime');
const { Movie } = require('../../../models/Movie');
const { Hall } = require('../../../models/Hall');
const { Setting } = require('../../../models/Setting');
let server;

describe('Showtimes', () => {
    beforeAll(async () => {
        server = require('../../../server');

        await Setting.create({
            key: 'min_minutes_interval_showtime',
            value: 30,
            type: 'number'
        });
    });
    afterAll(async () => {
        await Setting.deleteMany();
        await server.close();
    });
    afterEach(async () => {
        await Showtime.deleteMany();
    });

    describe('GET /api/v1/showtimes', () => {
        let movie;
        let hall;

        beforeAll(async () => {
            movie = await Movie.create({
                title: 'Spider man',
                description: 'Superhero with climbing abilities',
                releasedDate: '2023-01-23',
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
        });

        afterAll(async () => {
            await movie.remove();
            await hall.remove();
        });

        it('should return 200, and return all the showtimes if request is valid', async () => {
            await Showtime.create([
                {
                    startedDateTime: '2023-10-20 17:00',
                    movie: movie._id,
                    hall: hall._id
                },
                {
                    startedDateTime: '2023-10-20 10:50',
                    movie: movie._id,
                    hall: hall._id
                }
            ]);

            const res = await request(server).get('/api/v1/showtimes');
            const { items } = res.body.data;

            expect(res.status).toBe(200);
            expect(
                items.some(
                    (s) =>
                        new Date(s.startedDateTime).toISOString() ===
                        new Date('2023-10-20 17:00').toISOString()
                )
            ).toBeTruthy();
            expect(
                items.some(
                    (s) =>
                        new Date(s.startedDateTime).toISOString() ===
                        new Date('2023-10-20 10:50').toISOString()
                )
            ).toBeTruthy();
            expect(items).toHaveLength(2);
        });
    });

    describe('GET /api/v1/movies/:movieId/showtimes', () => {
        let movie;
        let movieId;
        let hall;
        let hallId;

        beforeEach(async () => {
            movie = await Movie.create({
                title: 'Spider man',
                description: 'Superhero with climbing abilities',
                releasedDate: '2023-01-23',
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

            movieId = movie._id;
            hallId = hall._id;

            const showtimes = await Showtime.create([
                {
                    startedDateTime: '2023-10-20 17:00',
                    movie: movieId,
                    hall: hallId
                },
                {
                    startedDateTime: '2023-08-20 10:50',
                    movie: movieId,
                    hall: hallId
                }
            ]);
        });

        afterEach(async () => {
            await movie.remove();
            await hall.remove();
        });

        const exec = () =>
            request(server).get(`/api/v1/movies/${movieId}/showtimes`);

        it('should return 404 if object ID of movie is not valid', async () => {
            movieId = 1;
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 404 of object ID of movie does not exist', async () => {
            movieId = mongoose.Types.ObjectId();
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 200, and return all the showtimes of the movie if request is valid', async () => {
            const res = await exec();
            const { items } = res.body.data;

            expect(res.status).toBe(200);
            expect(
                items.some(
                    (s) =>
                        new Date(s.startedDateTime).toISOString() ===
                        new Date('2023-10-20 17:00').toISOString()
                )
            ).toBeTruthy();
            expect(
                items.some(
                    (s) =>
                        new Date(s.startedDateTime).toISOString() ===
                        new Date('2023-08-20 10:50').toISOString()
                )
            ).toBeTruthy();
            expect(items).toHaveLength(2);
        });
    });

    describe('GET /api/v1/showtimes/:id', () => {
        let showtime;
        let showtimeId;
        let movie;
        let hall;

        beforeEach(async () => {
            showtime = await Showtime.create({
                startedDateTime: '2023-10-20 17:00',
                movie: movie._id,
                hall: hall._id
            });

            showtimeId = showtime._id;
        });
        afterEach(async () => {
            await Showtime.deleteMany();
        });

        beforeAll(async () => {
            movie = await Movie.create({
                title: 'Spider man',
                description: 'Superhero with climbing abilities',
                releasedDate: '2023-01-23',
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
        });

        afterAll(async () => {
            await movie.remove();
            await hall.remove();
        });

        const exec = () =>
            request(server).get(`/api/v1/showtimes/${showtimeId}`);

        it('should return 404 if object ID of showtime is not valid', async () => {
            showtimeId = 1;
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 404 of object ID of showtime does not exist', async () => {
            showtimeId = mongoose.Types.ObjectId();
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 200, and return the showtime if object ID is valid and exist', async () => {
            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveProperty(
                '_id',
                showtimeId.toHexString()
            );
            expect(res.body.data).toHaveProperty('startedDateTime');
            expect(new Date(res.body.data.startedDateTime).toISOString()).toBe(
                new Date('2023-10-20 17:00').toISOString()
            );
            expect(res.body.data).toHaveProperty('movie');
            expect(res.body.data.movie).toHaveProperty(
                '_id',
                movie._id.toHexString()
            );
            expect(res.body.data).toHaveProperty('hall');
            expect(res.body.data.hall).toHaveProperty(
                '_id',
                hall._id.toHexString()
            );
            expect(res.body.data).toHaveProperty('endedDateTime');
        });
    });

    describe('POST /api/v1/showtimes', () => {
        let movie;
        let hall;
        let anotherHall;

        const data = {
            startedDateTime: '2023-10-20 17:00'
        };

        beforeEach(async () => {
            movie = await Movie.create({
                title: 'Spider man',
                description: 'Superhero with climbing abilities',
                releasedDate: '2023-01-23',
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

            anotherHall = await Hall.create({
                name: 'Hall Two',
                seatRows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
                seatColumns: [1, 2, 3, 4, 5, 6, 7],
                cinema: mongoose.Types.ObjectId(),
                hallType: mongoose.Types.ObjectId()
            });

            data.movieId = movie._id;
            data.hallId = hall._id;
        });

        afterEach(async () => {
            await movie.remove();
            await hall.remove();
            await anotherHall.remove();
        });

        const exec = () => request(server).post('/api/v1/showtimes');

        it('should return 400 if startedDateTime is not provided', async () => {
            const curData = { ...data };
            delete curData.startedDateTime;

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if startedDateTime is not a date string', async () => {
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

        it('should return 400 if startedDateTime is not in valid ISO format', async () => {
            const curData = { ...data };
            curData.startedDateTime = '20-10-20 17:00';

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if movieId is not provided', async () => {
            const curData = { ...data };
            delete curData.movieId;

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if movieId is not a valid object Id', async () => {
            const curData = { ...data };
            curData.movieId = 1;

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 404 if movieId does not exist', async () => {
            const curData = { ...data };
            curData.movieId = mongoose.Types.ObjectId();

            const res = await exec().send(curData);

            expect(res.status).toBe(404);
        });

        it('should return 400 if hallId is not provided', async () => {
            const curData = { ...data };
            delete curData.hallId;

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if hallId is not a valid object Id', async () => {
            const curData = { ...data };
            curData.hallId = 1;

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 404 if hallId does not exist', async () => {
            const curData = { ...data };
            curData.hallId = mongoose.Types.ObjectId();

            const res = await exec().send(curData);

            expect(res.status).toBe(404);
        });

        it('should return 400 if showtime startedDateTime overlapping another showtime of same hall', async () => {
            const curData = { ...data };
            curData.startedDateTime = '2023-10-20 16:30';
            const res1 = await exec().send(curData);

            const res2 = await exec().send(data);

            expect(res1.status).toBe(201);
            expect(res2.status).toBe(400);
        });

        it('should return 400 if showtime endedDateTime overlapping another showtime of same hall', async () => {
            const curData = { ...data };
            curData.startedDateTime = '2023-10-20 16:30';
            const res1 = await exec().send(curData);

            curData.startedDateTime = '2023-10-20 14:01';
            const res2 = await exec().send(curData);

            expect(res1.status).toBe(201);
            expect(res2.status).toBe(400);
        });

        it('should return 201, and added the showtime if showtime startedDateTime not overlapping another showtime of same hall', async () => {
            const curData = { ...data };
            curData.startedDateTime = '2023-10-20 16:30';
            const res1 = await exec().send(curData);

            curData.hallId = anotherHall._id;
            const res2 = await exec().send(curData);

            const showtime1 = await Showtime.find({
                movie: movie._id,
                hall: hall._id
            });
            const showtime2 = await Showtime.find({
                movie: movie._id,
                hall: anotherHall._id
            });

            expect(res1.status).toBe(201);
            expect(res2.status).toBe(201);

            expect(showtime1).not.toBeNull();
            expect(showtime2).not.toBeNull();
        });

        it('should return 201, and added the showtime if showtime endedDateTime not overlapping another showtime of same hall', async () => {
            const curData = { ...data };
            curData.startedDateTime = '2023-10-20 16:30';
            const res1 = await exec().send(curData);

            curData.startedDateTime = '2023-10-20 14:00';
            curData.hallId = anotherHall._id;
            const res2 = await exec().send(curData);

            const showtime1 = await Showtime.find({
                movie: movie._id,
                hall: hall._id
            });
            const showtime2 = await Showtime.find({
                movie: movie._id,
                hall: anotherHall._id
            });

            expect(res1.status).toBe(201);
            expect(res2.status).toBe(201);

            expect(showtime1).not.toBeNull();
            expect(showtime2).not.toBeNull();
        });

        it('should return 201, and endedDateTime is set correctly if request is valid', async () => {
            const res = await exec().send(data);
            const { startedDateTime, endedDateTime } = res.body.data;

            const minutesStartedDateTime = new Date(startedDateTime).getTime();
            const minutesEndedDateTime = new Date(endedDateTime).getTime();
            const calculatedMovieDuration =
                (minutesEndedDateTime - minutesStartedDateTime) / 1000 / 60;

            expect(res.status).toBe(201);
            expect(calculatedMovieDuration).toBe(movie.durationInMinutes);
        });

        it('should return 201, and return the created showtime if request is valid', async () => {
            const res = await exec().send(data);
            const { data: dt } = res.body;

            expect(res.status).toBe(201);
            expect(dt).toHaveProperty('_id');
            expect(dt).toHaveProperty('startedDateTime');
            expect(dt).toHaveProperty('endedDateTime');
            expect(dt).toHaveProperty('movie');
            expect(dt).toHaveProperty('hall');
            expect(dt).toHaveProperty('createdAt');
        });
    });

    describe('PUT /api/v1/showtimes/:id', () => {
        let showtime;
        let showtimeId;
        let movie;
        let hall;

        beforeAll(async () => {
            movie = await Movie.create({
                title: 'Spider man',
                description: 'Superhero with climbing abilities',
                releasedDate: '2023-01-23',
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
        });

        beforeEach(async () => {
            showtime = await Showtime.create({
                startedDateTime: '2023-10-20 17:00',
                movie: movie._id,
                hall: hall._id
            });

            showtimeId = showtime._id;
        });
        afterEach(async () => {
            await Showtime.deleteMany();
        });
        afterAll(async () => {
            await movie.remove();
            await hall.remove();
        });

        const exec = () =>
            request(server).put(`/api/v1/showtimes/${showtimeId}`);

        it('should return 404 if object ID of showtime is not valid', async () => {
            showtimeId = 1;
            const res = await exec().send({});

            expect(res.status).toBe(404);
        });

        it('should return 404 of object ID of showtime does not exist', async () => {
            showtimeId = mongoose.Types.ObjectId();
            const res = await exec().send({});

            expect(res.status).toBe(404);
        });

        it('should return 400 if startedDateTime is not a date string', async () => {
            const res = await exec().send({ startedDateTime: true });

            expect(res.status).toBe(400);
        });

        it('should return 400 if startedDateTime is an empty string', async () => {
            const res = await exec().send({ startedDateTime: '' });

            expect(res.status).toBe(400);
        });

        it('should return 400 if startedDateTime is not in valid ISO format', async () => {
            const res = await exec().send({
                startedDateTime: '20-10-20 17:00'
            });

            expect(res.status).toBe(400);
        });

        it('should return 400 if movieId is not a valid object Id', async () => {
            const res = await exec().send({ movieId: 1 });

            expect(res.status).toBe(400);
        });

        it('should return 404 if movieId does not exist', async () => {
            const res = await exec().send({
                movieId: mongoose.Types.ObjectId()
            });

            expect(res.status).toBe(404);
        });

        it('should return 400 if hallId is not a valid object Id', async () => {
            const res = await exec().send({ hallId: 1 });

            expect(res.status).toBe(400);
        });

        it('should return 404 if hallId does not exist', async () => {
            const res = await exec().send({
                hallId: mongoose.Types.ObjectId()
            });

            expect(res.status).toBe(404);
        });

        it('should return 400 if showtime startedDateTime overlapping another showtime of same hall', async () => {
            await Showtime.create({
                startedDateTime: '2023-10-20 19:30',
                movie: movie._id,
                hall: hall._id
            });

            const res = await exec().send({
                startedDateTime: '2023-10-20 19:50'
            });

            expect(res.status).toBe(400);
        });

        it('should return 400 if showtime endedDateTime overlapping another showtime of same hall', async () => {
            await Showtime.create({
                startedDateTime: '2023-10-20 19:30',
                movie: movie._id,
                hall: hall._id
            });

            const res = await exec().send({
                startedDateTime: '2023-10-20 18:30'
            });

            expect(res.status).toBe(400);
        });

        it('should return 200, and update the showtime if request is valid', async () => {
            const res = await exec().send({
                startedDateTime: '2024-10-20 14:00',
                movieId: movie._id,
                hallId: hall._id
            });

            const showtimeInDb = await Showtime.findById(showtimeId);

            expect(res.status).toBe(200);
            expect(new Date(showtimeInDb.startedDateTime).toISOString()).toBe(
                new Date('2024-10-20 14:00').toISOString()
            );
            expect(showtimeInDb.movie.toHexString()).toBe(
                movie._id.toHexString()
            );
            expect(showtimeInDb.hall.toHexString()).toBe(
                hall._id.toHexString()
            );
            expect(showtimeInDb.updatedAt).not.toBeNull();
        });

        it('should return 200, and return the updated showtime if request is valid', async () => {
            const res = await exec().send({
                startedDateTime: '2024-10-20 14:00',
                movieId: movie._id,
                hallId: hall._id
            });

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveProperty(
                '_id',
                showtimeId.toHexString()
            );
            expect(res.body.data).toHaveProperty('startedDateTime');
            expect(new Date(res.body.data.startedDateTime).toISOString()).toBe(
                new Date('2024-10-20 14:00').toISOString()
            );
            expect(res.body.data).toHaveProperty(
                'movie',
                movie._id.toHexString()
            );
            expect(res.body.data).toHaveProperty(
                'hall',
                hall._id.toHexString()
            );
            expect(res.body.data).toHaveProperty('updatedAt');
        });
    });

    describe('DELETE /api/v1/showtimes/:id', () => {
        let showtime;
        let showtimeId;
        let movie;
        let hall;

        beforeAll(async () => {
            movie = await Movie.create({
                title: 'Spider man',
                description: 'Superhero with climbing abilities',
                releasedDate: '2023-01-23',
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
        });

        beforeEach(async () => {
            showtime = await Showtime.create({
                startedDateTime: '2023-10-20 17:00',
                movie: movie._id,
                hall: hall._id
            });

            showtimeId = showtime._id;
        });
        afterEach(async () => {
            await Showtime.deleteMany();
        });
        afterAll(async () => {
            await movie.remove();
            await hall.remove();
        });

        const exec = () =>
            request(server).delete(`/api/v1/showtimes/${showtimeId}`);

        it('should return 404 if object ID of showtime is not valid', async () => {
            showtimeId = 1;
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 404 of object ID of showtime does not exist', async () => {
            showtimeId = mongoose.Types.ObjectId();
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 200, and delete the showtime if object ID is valid and exists', async () => {
            const res = await exec();

            const showtimeInDb = await Showtime.findById(
                showtimeId.toHexString()
            );

            expect(res.status).toBe(200);
            expect(showtimeInDb).toBeNull();
        });

        it('should return 200, and return the deleted showtime if object ID is valid and exists', async () => {
            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveProperty(
                '_id',
                showtimeId.toHexString()
            );
        });
    });
});
