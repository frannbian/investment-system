import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let createdUserId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/users (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .query({ page: 1, limit: 10 })
      .expect(200);

    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('total');
  });

  it('/users (POST)', async () => {
    const newUser = {
      email: 'john.doe@example.com',
      accountNumber: Math.floor(Math.random() * 900000) + 100000,
    };
    const response = await request(app.getHttpServer())
      .post('/users')
      .send(newUser)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('email', newUser.email);

    createdUserId = response.body.id;
  });

  it('/users/:id (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get(`/users/${createdUserId}`)
      .expect(200);

    expect(response.body).toHaveProperty('id', createdUserId);
  });

  it('/users/:id (PUT)', async () => {
    const updatedUser = { email: 'changed@email.com' };
    const response = await request(app.getHttpServer())
      .put(`/users/${createdUserId}`)
      .send(updatedUser)
      .expect(200);

    expect(response.body).toHaveProperty('id', createdUserId);
    expect(response.body).toHaveProperty('email', updatedUser.email);
  });

  it('/users/:id (DELETE)', async () => {
    await request(app.getHttpServer())
      .delete(`/users/${createdUserId}`)
      .expect(200);
  });

  it('/users/:id/portfolio (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get(`/users/${createdUserId}/portfolio`)
      .expect(200);

    expect(response.body).toHaveProperty('totalAccountValue');
    expect(response.body).toHaveProperty('availableCash');
    expect(response.body).toHaveProperty('summary');
  });
});
