const mongoose = require('mongoose');
const request = require('supertest');
const { User, ROLE_CUSTOMER } = require('../../../models/User');
let server;

describe('Authentication', () => {
  beforeAll(() => {
    server = require('../../../server');
  });

  afterAll(async () => {
    await server.close();
  });

  afterEach(async () => {
    await User.deleteMany();
  });

  describe('POST /api/v1/auth/register', () => {
    const data = {
      name: 'tvy',
      email: 'tvy@mail.com',
      password: '123456'
    };

    const exec = () => request(server).post('/api/v1/auth/register');

    it('should return 400 if name is not provided', async () => {
      const curData = { ...data };
      delete curData.name;

      const res = await exec().send(curData);

      expect(res.status).toBe(400);
    });

    it('should return 400 if name is not a string', async () => {
      const curData = { ...data };
      curData.name = 1;

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
      const name = new Array(52).join('a');
      curData.name = name;

      const res = await exec().send(curData);

      expect(res.status).toBe(400);
    });

    it('should return 400 if name is duplicated', async () => {
      const data2 = { ...data };
      data2.email = 'tvy2@mail.com';
      const res = await exec().send(data);

      const res2 = await exec().send(data2);

      expect(res.status).toBe(200);
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
      curData.email = 1;

      const res = await exec().send(curData);

      expect(res.status).toBe(400);
    });

    it('should return 400 if email is an empty string', async () => {
      const curData = { ...data };
      curData.email = '';

      const res = await exec().send(curData);

      expect(res.status).toBe(400);
    });

    it('should return 400 if email is not valid', async () => {
      const curData = { ...data };
      curData.email = 'tvymail.com';

      const res = await exec().send(curData);

      expect(res.status).toBe(400);
    });

    it('should return 400 if email is duplicated', async () => {
      const data2 = { ...data };
      data2.name = 'tvy2';
      const res = await exec().send(data);

      const res2 = await exec().send(data2);

      expect(res.status).toBe(200);
      expect(res2.status).toBe(400);
    });

    it('should return 400 if password is not provided', async () => {
      const curData = { ...data };
      delete curData.password;

      const res = await exec().send(curData);

      expect(res.status).toBe(400);
    });

    it('should return 400 if password is not a string', async () => {
      const curData = { ...data };
      curData.password = 1;

      const res = await exec().send(curData);

      expect(res.status).toBe(400);
    });

    it('should return 400 if password is an empty string', async () => {
      const curData = { ...data };
      curData.password = '';

      const res = await exec().send(curData);

      expect(res.status).toBe(400);
    });

    it('should return 400 if password has fewer than 6 characters', async () => {
      const curData = { ...data };
      curData.password = '12345';

      const res = await exec().send(curData);

      expect(res.status).toBe(400);
    });

    it('should return 200, and save the registered user to database if request is valid', async () => {
      const res = await exec().send(data);

      const userInDb = User.find({ name: 'tvy', email: 'tvy@mail.com' });

      expect(res.status).toBe(200);
      expect(userInDb).not.toBeNull();
    });

    it('should return 200, and return the registerd user if request is valid', async () => {
      const res = await exec().send(data);
      const { data: dt } = res.body;

      expect(res.status).toBe(200);
      expect(dt).toHaveProperty('name', 'tvy');
      expect(dt).toHaveProperty('email', 'tvy@mail.com');
      expect(dt).toHaveProperty('role', ROLE_CUSTOMER);
      expect(dt).not.toHaveProperty('password');
    });
  });

  describe('POST /api/v1/auth/login', () => {
    const data = {
      email: 'tvy@mail.com',
      password: '123456'
    };

    beforeEach(async () => {
      await User.create({
        name: 'tvy',
        email: data.email,
        password: data.password
      });
    });

    const exec = () => request(server).post('/api/v1/auth/login');

    it('should return 400 if email is not provided', async () => {
      const curData = { ...data };
      delete curData.email;

      const res = await exec().send(curData);

      expect(res.status).toBe(400);
    });

    it('should return 400 if email is not a string', async () => {
      const curData = { ...data };
      curData.email = 1;

      const res = await exec().send(curData);

      expect(res.status).toBe(400);
    });

    it('should return 400 if email is an empty string', async () => {
      const curData = { ...data };
      curData.email = '';

      const res = await exec().send(curData);

      expect(res.status).toBe(400);
    });

    it('should return 400 if email is not valid', async () => {
      const curData = { ...data };
      curData.email = 'tvymail.com';

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
      curData.password = 1;

      const res = await exec().send(curData);

      expect(res.status).toBe(400);
    });

    it('should return 400 if password is an empty string', async () => {
      const curData = { ...data };
      curData.password = '';

      const res = await exec().send(curData);

      expect(res.status).toBe(400);
    });

    it('should return 400 if email does not exist', async () => {
      const curData = { ...data };
      curData.email = 'tvy2@mail.com';

      const res = await exec().send(curData);

      expect(res.status).toBe(400);
    });

    it('should return 400 if password is not correct', async () => {
      const curData = { ...data };
      curData.password = '123455';

      const res = await exec().send(curData);

      expect(res.status).toBe(400);
    });

    it('should return 200, and return the token if request is valid', async () => {
      const res = await exec().send(data);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data).toHaveProperty('tokenExpiresAt');
    });
  });
});
