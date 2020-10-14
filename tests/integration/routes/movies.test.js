const request = require('supertest');
const { Movie } = require('../../../models/Movie');
const { Genre } = require('../../../models/Genre');
const { MovieType } = require('../../../models/MovieType');
const mongoose = require('mongoose');
let server;

describe('Movies', () => {
    beforeAll(() => {
        server = require('../../../server');
    });
    afterAll(async () => {
        await server.close();
    });
    afterEach(async () => {
        await Movie.deleteMany();
    });

    describe('GET /api/v1/movies', () => {
        it('should return 200, and return all the movies', async () => {
            await Movie.create([
                {
                    title: 'Spider man',
                    description: 'Superhero with climbing abilities',
                    releasedDate: '2020-01-23',
                    ticketPrice: 2.5,
                    durationInMinutes: 120,
                    genres: [
                        '5f85b4bb8be19d2788193471',
                        '5f85b58f15173c139c7476b7'
                    ],
                    movieType: '5f84030ea795143ed451ddbf',
                    trailerUrl: 'https://youtu.be/dR3cjXncoSk',
                    posterUrl:
                        'https://i.pinimg.com/originals/e6/a2/5a/e6a25a2855e741f7461fe1698db3153a.jpg'
                },
                {
                    title: 'Toy Story',
                    description: 'Animated toys of a boy',
                    releasedDate: '2019-10-01',
                    ticketPrice: 2,
                    durationInMinutes: 80,
                    genres: [
                        '5f85b59cca353939f0b98e78',
                        '5f85b58f15173c139c7476b7'
                    ],
                    movieType: '5f8409065fc86e09e4752519',
                    trailerUrl: 'https://youtu.be/wmiIUN-7qhE',
                    posterUrl:
                        'https://images-na.ssl-images-amazon.com/images/I/714hR8KCqaL._AC_SL1308_.jpg'
                }
            ]);

            const res = await request(server).get('/api/v1/movies');
            const { items } = res.body.data;

            expect(res.status).toBe(200);
            expect(items.some((m) => m.title === 'Spider man')).toBeTruthy();
            expect(items.some((m) => m.title === 'Toy Story')).toBeTruthy();
            expect(items).toHaveLength(2);
        });
    });

    describe('GET /api/v1/movies/:id', () => {
        let movie;
        let movieId;

        beforeEach(async () => {
            movie = await Movie.create({
                title: 'Spider man',
                description: 'Superhero with climbing abilities',
                releasedDate: '2020-01-23',
                ticketPrice: 2.5,
                durationInMinutes: 120,
                trailerUrl: 'https://youtu.be/dR3cjXncoSk',
                posterUrl:
                    'https://i.pinimg.com/originals/e6/a2/5a/e6a25a2855e741f7461fe1698db3153a.jpg',
                genres: [
                    '5f85b4bb8be19d2788193471',
                    '5f85b58f15173c139c7476b7'
                ],
                movieType: '5f84030ea795143ed451ddbf'
            });

            movieId = movie._id;
        });
        afterEach(async () => {
            await movie.remove();
        });

        const exec = () => request(server).get(`/api/v1/movies/${movieId}`);

        it('should return 404 if object ID is not valid', async () => {
            movieId = 1;
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 404 if object ID of movie does not exist', async () => {
            movieId = mongoose.Types.ObjectId();
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 200, and return the movie if the request is valid', async () => {
            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveProperty('_id', movieId.toHexString());
            expect(res.body.data).toHaveProperty('title', 'Spider man');
            expect(res.body.data).toHaveProperty(
                'description',
                'Superhero with climbing abilities'
            );
            expect(res.body.data).toHaveProperty('createdAt');
        });
    });

    describe('POST /api/v1/movies', () => {
        let genreAction;
        let genreHorror;
        let movieType;

        const data = {
            title: 'Spider man',
            description: 'Superhero with climbing abilities',
            releasedDate: '2020-01-23',
            ticketPrice: 2.5,
            durationInMinutes: 120,
            trailerUrl: 'https://youtu.be/dR3cjXncoSk',
            posterUrl:
                'https://i.pinimg.com/originals/e6/a2/5a/e6a25a2855e741f7461fe1698db3153a.jpg'
        };

        beforeEach(async () => {
            genreAction = await Genre.create({
                name: 'Action',
                description: 'Fighting scenes'
            });

            genreHorror = await Genre.create({
                name: 'Horror',
                description: 'Ghosts, scary things'
            });

            movieType = await MovieType.create({
                name: '2D',
                description: 'Simple 2D technology'
            });

            data.genreIds = [genreAction._id, genreHorror._id];
            data.movieTypeId = movieType._id;
        });

        afterEach(async () => {
            await MovieType.deleteMany();
            await Genre.deleteMany();
        });

        const exec = () => request(server).post('/api/v1/movies');

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

        it('should return 400 if title is more than 100 characters', async () => {
            const curData = { ...data };
            const title = new Array(102).join('a');
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

        it('should return 400 if ticketPrice is not provided', async () => {
            const curData = { ...data };
            delete curData.ticketPrice;

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if ticketPrice is not a number', async () => {
            const curData = { ...data };
            curData.ticketPrice = true;

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if ticketPrice is less than zero', async () => {
            const curData = { ...data };
            curData.ticketPrice = -1;

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if durationInMinutes is not provided', async () => {
            const curData = { ...data };
            delete curData.durationInMinutes;

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if durationInMinutes is not a number', async () => {
            const curData = { ...data };
            curData.durationInMinutes = true;

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if durationInMinutes is not an integer', async () => {
            const curData = { ...data };
            curData.durationInMinutes = 2.2;

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if durationInMinutes is less than zero', async () => {
            const curData = { ...data };
            curData.durationInMinutes = -1;

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if releasedDate is not provided', async () => {
            const curData = { ...data };
            delete curData.releasedDate;

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if releasedDate is not a date string', async () => {
            const curData = { ...data };
            curData.releasedDate = true;

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if releasedDate is not a valid date string', async () => {
            const curData = { ...data };
            curData.releasedDate = '10-10-10';

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if trailerUrl is not a valid URL', async () => {
            const curData = { ...data };
            curData.trailerUrl = 'qwe';

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if posterUrl is not a valid URL', async () => {
            const curData = { ...data };
            curData.posterUrl = 'qwe';

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if genreIds is not provided', async () => {
            const curData = { ...data };
            delete curData.genreIds;

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if genreIds is not an array', async () => {
            const curData = { ...data };
            curData.genreIds = true;

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if genreIds is an empty array', async () => {
            const curData = { ...data };
            curData.genreIds = [];

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if genreIds is not an array of valid object ID', async () => {
            const curData = { ...data };
            curData.genreIds = [mongoose.Types.ObjectId(), 1];

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 404 if any genreId of genreIds array does not exist', async () => {
            const curData = { ...data };
            curData.genreIds = [mongoose.Types.ObjectId()];

            const res = await exec().send(curData);

            expect(res.status).toBe(404);
        });

        it('should return 400 if movieTypeId is not provided', async () => {
            const curData = { ...data };
            delete curData.movieTypeId;

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 400 if movieTypeId is not a valid object Id', async () => {
            const curData = { ...data };
            curData.movieTypeId = 1;

            const res = await exec().send(curData);

            expect(res.status).toBe(400);
        });

        it('should return 404 if movieTypeId does not exist', async () => {
            const curData = { ...data };
            curData.movieTypeId = mongoose.Types.ObjectId();

            const res = await exec().send(curData);

            expect(res.status).toBe(404);
        });

        it('should return 201, and create the movie if the request is valid', async () => {
            const res = await exec().send(data);

            const movieInDb = await Movie.find({
                name: 'Spider man',
                movieTypes: movieType._id,
                genres: [genreAction._id, genreHorror._id]
            });

            expect(res.status).toBe(201);
            expect(movieInDb).not.toBeNull();
        });

        it('should return 201, and return the created movie if the request is valid', async () => {
            const res = await exec().send(data);
            const { data: dt } = res.body;

            expect(res.status).toBe(201);
            expect(dt).toHaveProperty('_id');
            expect(dt).toHaveProperty('title', 'Spider man');
            expect(dt).toHaveProperty(
                'description',
                'Superhero with climbing abilities'
            );
            expect(dt).toHaveProperty('releasedDate');
            expect(dt).toHaveProperty('ticketPrice', 2.5);
            expect(dt).toHaveProperty('durationInMinutes', 120);
            expect(dt).toHaveProperty(
                'trailerUrl',
                'https://youtu.be/dR3cjXncoSk'
            );
            expect(dt).toHaveProperty(
                'posterUrl',
                'https://i.pinimg.com/originals/e6/a2/5a/e6a25a2855e741f7461fe1698db3153a.jpg'
            );
            expect(dt).toHaveProperty('createdAt');
            expect(dt).toHaveProperty('movieType', movieType._id.toHexString());
            expect(dt).toHaveProperty('genres');
            expect(dt.genres).toContain(genreAction._id.toHexString());
            expect(dt.genres).toContain(genreHorror._id.toHexString());
            expect(dt.genres).toHaveLength(2);
        });
    });
});
