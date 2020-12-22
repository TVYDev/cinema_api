const request = require('supertest');
const mongoose = require('mongoose');
const fs = require('fs');
const {
  Purchase,
  STATUS_INITIATED,
  STATUS_CREATED,
  STATUS_EXECUTED
} = require('../../../models/Purchase');
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

  describe('GET /api/v1/purchases', () => {
    let showtime;
    let movie;
    let hall;

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
    });

    afterEach(async () => {
      await Showtime.deleteMany();
      await Movie.deleteMany();
      await Hall.deleteMany();
    });

    it('should return 200, and return all purchases', async () => {
      await Purchase.create([
        {
          numberTickets: 2,
          chosenSeats: ['A1', 'A2'],
          showtime: showtime._id,
          status: STATUS_INITIATED,
          originalAmount: 5,
          qrCodeImage: 'no-photo.png',
          discount: {
            type: 'flat',
            amount: 0
          }
        },
        {
          numberTickets: 2,
          chosenSeats: ['A3', 'A4'],
          showtime: showtime._id,
          status: STATUS_CREATED,
          originalAmount: 5,
          qrCodeImage: 'no-photo.png',
          discount: {
            type: 'flat',
            amount: 0
          }
        }
      ]);

      const res = await request(server).get('/api/v1/purchases');
      const { items } = res.body.data;

      expect(res.status).toBe(200);
      expect(items.length).toBe(2);
      expect(items.some((p) => p.status === STATUS_INITIATED)).toBeTruthy();
      expect(items.some((p) => p.status === STATUS_CREATED)).toBeTruthy();
    });
  });

  describe('GET /api/v1/purchases/:id', () => {
    let showtime;
    let movie;
    let hall;
    let purchase;
    let purchaseId;

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

      purchase = await Purchase.create({
        numberTickets: 2,
        chosenSeats: ['A1', 'A2'],
        showtime: showtime._id,
        status: STATUS_INITIATED,
        originalAmount: 5,
        qrCodeImage: 'no-photo.png',
        discount: {
          type: 'flat',
          amount: 0
        }
      });

      purchaseId = purchase._id;
    });

    afterEach(async () => {
      await Showtime.deleteMany();
      await Movie.deleteMany();
      await Hall.deleteMany();
      await Purchase.deleteMany();
    });

    const exec = () => request(server).get(`/api/v1/purchases/${purchaseId}`);

    it('should return 404 if object Id is invalid', async () => {
      purchaseId = 1;
      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should return 404 if object Id does not exist', async () => {
      purchaseId = mongoose.Types.ObjectId();
      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should return 200, and return the purchase if object ID is valid and does exist', async () => {
      const res = await exec();
      const { data: dt } = res.body;

      expect(res.status).toBe(200);
      expect(dt).toHaveProperty('status', STATUS_INITIATED);
      expect(dt).toHaveProperty('numberTickets', 2);
      expect(dt).toHaveProperty('originalAmount', 5);
    });
  });

  describe('POST /api/v1/purchases/initiate', () => {
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
      expect(dt).toHaveProperty('status', STATUS_INITIATED);
      expect(dt).toHaveProperty('expiredSeatSelectionAt');
      expect(dt).toHaveProperty('createdAt');
      expect(dt).toHaveProperty('chosenSeats');

      expect(dt.chosenSeats).toHaveLength(2);
    });
  });

  describe('PUT /api/v1/purchases/:id/create', () => {
    let purchase;
    let purchaseId;
    let movie;
    let hall;
    let showtime;

    const data = {
      chosenSeats: ['A1', 'A2']
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

      purchase = await Purchase.create({
        numberTickets: 2,
        chosenSeats: ['A1', 'A2'],
        showtime: showtime._id,
        status: STATUS_INITIATED,
        originalAmount: 5,
        qrCodeImage: 'no-photo.png',
        discount: {
          type: 'flat',
          amount: 0
        }
      });

      purchaseId = purchase._id;
    });

    afterEach(async () => {
      await Purchase.deleteMany();
      await Showtime.deleteMany();
      await Movie.deleteMany();
      await Hall.deleteMany();
    });

    const exec = () =>
      request(server).put(`/api/v1/purchases/${purchaseId}/create`);

    it('should return 400 if chosenSeats is not provided', async () => {
      const res = await exec().send({});

      expect(res.status).toBe(400);
    });

    it('should return 400 if chosenSeats is not an array', async () => {
      const res = await exec().send({ chosenSeats: true });

      expect(res.status).toBe(400);
    });

    it('should return 400 if chosenSeats is an empty array', async () => {
      const res = await exec().send({ chosenSeats: [] });

      expect(res.status).toBe(400);
    });

    it('should return 400 if chosenSeats is not an array of only string', async () => {
      const res = await exec().send({ chosenSeats: [true, 'A1'] });

      expect(res.status).toBe(400);
    });

    it('should return 404 if object Id of purchase is not valid', async () => {
      purchaseId = 1;
      const res = await exec().send(data);

      expect(res.status).toBe(404);
    });

    it('should return 404 if object ID of purchase does not exist', async () => {
      purchaseId = mongoose.Types.ObjectId();
      const res = await exec().send(data);

      expect(res.status).toBe(404);
    });

    it('should return 400 if purchase is not in initiated status', async () => {
      const createdPurchase = await Purchase.create({
        numberTickets: 2,
        chosenSeats: ['A3', 'A4'],
        showtime: showtime._id,
        status: STATUS_CREATED,
        originalAmount: 5,
        qrCodeImage: 'no-photo.png',
        discount: {
          type: 'flat',
          amount: 0
        }
      });

      purchaseId = createdPurchase._id;

      const res = await exec().send({ chosenSeats: ['B1', 'B2'] });

      expect(res.status).toBe(400);
    });

    it('should return 400 if expiredSeatSelection is already expired', async () => {
      const createdPurchase = await Purchase.create({
        numberTickets: 2,
        chosenSeats: ['A3', 'A4'],
        showtime: showtime._id,
        status: STATUS_CREATED,
        originalAmount: 5,
        qrCodeImage: 'no-photo.png',
        discount: {
          type: 'flat',
          amount: 0
        },
        createdAt: '2020-11-04 10:00:00'
      });

      purchaseId = createdPurchase._id;

      const res = await exec().send({ chosenSeats: ['B1', 'B2'] });

      expect(res.status).toBe(400);
    });

    it('should return 400 if chosenSeats length is greater than number of tickets in initiated status', async () => {
      const res = await exec().send({ chosenSeats: ['A1', 'A2', 'A3'] });

      expect(res.status).toBe(400);
    });

    it('should return 400 if chosenSeats length is less than number of tickets in initiated status', async () => {
      const res = await exec().send({ chosenSeats: ['A1'] });

      expect(res.status).toBe(400);
    });

    it('should return 400 if chosenSeats has invalid seat label', async () => {
      const res = await exec().send({ chosenSeats: ['Z1', 'A2'] });

      expect(res.status).toBe(400);
    });

    it('should return 400 if any of chosenSeats are already selected', async () => {
      await Purchase.create({
        numberTickets: 2,
        chosenSeats: ['A3', 'A4'],
        showtime: showtime._id,
        status: STATUS_INITIATED,
        originalAmount: 5,
        qrCodeImage: 'no-photo.png',
        discount: {
          type: 'flat',
          amount: 0
        }
      });

      const res = await exec().send({ chosenSeats: ['A1', 'A3'] });

      expect(res.status).toBe(400);
    });

    it('should return 200, and update info of the purchase to be in created status if request is valid', async () => {
      const res = await exec().send(data);

      const purchaseInDb = await Purchase.findById(purchaseId);

      expect(res.status).toBe(200);
      expect(purchaseInDb.status).toBe(STATUS_CREATED);
      expect(purchaseInDb.chosenSeats).toEqual(
        expect.arrayContaining(['A1', 'A2'])
      );
    });

    it('should return 200, and update info the purchase to be in created status if request is valid (case change chosenSeats', async () => {
      const res = await exec().send({ chosenSeats: ['A3', 'A4'] });

      const purchaseInDb = await Purchase.findById(purchaseId);

      expect(res.status).toBe(200);
      expect(purchaseInDb.status).toBe(STATUS_CREATED);
      expect(purchaseInDb.chosenSeats).toEqual(
        expect.arrayContaining(['A3', 'A4'])
      );
    });

    it('should return 200, and return the created purchase if request is valid', async () => {
      const res = await exec().send(data);
      const { data: dt } = res.body;

      expect(res.status).toBe(200);
      expect(dt).toHaveProperty('_id', purchaseId.toHexString());
      expect(dt).toHaveProperty('status', STATUS_CREATED);
      expect(dt).toHaveProperty('chosenSeats');
      expect(dt).toHaveProperty('originalAmount');
      expect(dt).toHaveProperty('numberTickets');
      expect(dt).toHaveProperty('showtime');
      expect(dt).toHaveProperty('qrCodeImage');

      expect(dt.chosenSeats).toEqual(expect.arrayContaining(['A1', 'A2']));
    });
  });

  describe('PUT /api/v1/purchases/:id/execute', () => {
    let purchase;
    let purchaseId;
    let movie;
    let hall;
    let showtime;
    let createdFileUrl = undefined;

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

      purchase = await Purchase.create({
        numberTickets: 2,
        chosenSeats: ['A1', 'A2'],
        showtime: showtime._id,
        status: STATUS_CREATED,
        originalAmount: 5,
        qrCodeImage: 'no-photo.png',
        discount: {
          type: 'flat',
          amount: 0
        }
      });

      purchaseId = purchase._id;
    });

    afterEach(async () => {
      await Purchase.deleteMany();
      await Showtime.deleteMany();
      await Movie.deleteMany();
      await Hall.deleteMany();

      if (createdFileUrl !== undefined) {
        fs.unlinkSync(createdFileUrl);
      }
    });

    const exec = () =>
      request(server).put(`/api/v1/purchases/${purchaseId}/execute`);

    it('should return 404 if object Id of purchase is not valid', async () => {
      purchaseId = 1;
      const res = await exec().send({});

      expect(res.status).toBe(404);
    });

    it('should return 404 if object Id of purchase does not exist', async () => {
      purchaseId = mongoose.Types.ObjectId();
      const res = await exec().send({});

      expect(res.status).toBe(404);
    });

    it('should return 400 if purchase is not in created status', async () => {
      const createdPurchase = await Purchase.create({
        numberTickets: 2,
        chosenSeats: ['A3', 'A4'],
        showtime: showtime._id,
        status: STATUS_INITIATED,
        originalAmount: 5,
        qrCodeImage: 'no-photo.png',
        discount: {
          type: 'flat',
          amount: 0
        }
      });

      purchaseId = createdPurchase._id;

      const res = await exec().send({});

      expect(res.status).toBe(400);
    });

    it('should return 200, and update info of the purchase to be in executed status if request is valid', async () => {
      const res = await exec().send({});
      createdFileUrl = `${process.env.FILE_GENERATED_PATH}/${res.body.data.qrCodeImage}`;

      const purchaseInDb = await Purchase.findById(purchaseId);

      expect(res.status).toBe(200);
      expect(purchaseInDb.status).toBe(STATUS_EXECUTED);
      expect(purchaseInDb.qrCodeImage).not.toEqual('no-photo.png');
      expect(purchaseInDb.paymentDateTime).not.toBeNull();
      expect(purchaseInDb.paymentAmount).not.toBeNull();
      expect(purchaseInDb.paymentAmount).toEqual(purchaseInDb.originalAmount);
    });

    it('should return 200, and save QR code of the purchase if request is valid', async () => {
      const res = await exec().send({});
      createdFileUrl = `${process.env.FILE_GENERATED_PATH}/${res.body.data.qrCodeImage}`;

      expect(res.status).toBe(200);
      expect(fs.existsSync(createdFileUrl)).toBeTruthy();
    });

    it('should return 200, and return the executed purchase if request is valid', async () => {
      const res = await exec().send({});
      createdFileUrl = `${process.env.FILE_GENERATED_PATH}/${res.body.data.qrCodeImage}`;
      const { data: dt } = res.body;

      expect(res.status).toBe(200);
      expect(dt).toHaveProperty('_id', purchaseId.toHexString());
      expect(dt).toHaveProperty('status', STATUS_EXECUTED);
      expect(dt).toHaveProperty('paymentAmount');
      expect(dt).toHaveProperty('paymentDateTime');
      expect(dt).toHaveProperty('qrCodeImage');

      expect(dt.originalAmount).toEqual(dt.paymentAmount);
    });
  });
});
