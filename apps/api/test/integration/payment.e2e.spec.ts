import { type INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { AppModule } from '../../src/app.module';

describe('Payment API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.DB_TYPE = 'sqljs';
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.enableVersioning({ type: VersioningType.URI });
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    await app.init();
  }, 30_000);

  afterAll(async () => {
    await app?.close();
  });

  describe('GET /health', () => {
    it('should return healthy status', async () => {
      const res = await request(app.getHttpServer()).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
    });
  });

  describe('GET /v1/payments', () => {
    it('should return paginated list with correct structure', async () => {
      const res = await request(app.getHttpServer()).get('/v1/payments');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.meta).toMatchObject({
        total: expect.any(Number),
        page: 1,
        limit: 10,
        totalPages: expect.any(Number),
      });
    });

    it('should accept page and limit query params', async () => {
      const res = await request(app.getHttpServer()).get('/v1/payments?page=1&limit=5');
      expect(res.status).toBe(200);
      expect(Number(res.body.meta.limit)).toBe(5);
    });
  });

  describe('POST /v1/payments', () => {
    it('should create a payment with valid data', async () => {
      const res = await request(app.getHttpServer()).post('/v1/payments').send({
        cardNumber: '4532015112830366',
        expirationDate: '12/30',
        cvv: '123',
        cardholderName: 'JOHN DOE',
        amount: 100,
      });

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        transactionId: expect.stringMatching(/^txn_/),
        status: expect.stringMatching(/^(approved|refused)$/i),
        totalTimeMs: expect.any(Number),
        strategy: expect.any(String),
      });
      expect(res.body).toHaveProperty('steps');
      expect(Array.isArray(res.body.steps)).toBe(true);
      expect(res.body.steps).toHaveLength(6);
    }, 30_000);

    it('should reject invalid card number', async () => {
      const res = await request(app.getHttpServer()).post('/v1/payments').send({
        cardNumber: '',
        expirationDate: '12/30',
        cvv: '123',
        cardholderName: 'JOHN DOE',
        amount: 100,
      });

      expect(res.status).toBe(400);
    });

    it('should reject missing amount', async () => {
      const res = await request(app.getHttpServer()).post('/v1/payments').send({
        cardNumber: '4532015112830366',
        expirationDate: '12/30',
        cvv: '123',
        cardholderName: 'JOHN DOE',
      });

      expect(res.status).toBe(400);
    });

    it('should reject negative amount', async () => {
      const res = await request(app.getHttpServer()).post('/v1/payments').send({
        cardNumber: '4532015112830366',
        expirationDate: '12/30',
        cvv: '123',
        cardholderName: 'JOHN DOE',
        amount: -10,
      });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /v1/payments/:transactionId', () => {
    it('should return 404 for non-existent transaction', async () => {
      const res = await request(app.getHttpServer()).get('/v1/payments/txn_NONEXISTENT');
      expect(res.status).toBe(404);
    });

    it('should return payment after creation', async () => {
      const createRes = await request(app.getHttpServer()).post('/v1/payments').send({
        cardNumber: '4532015112830366',
        expirationDate: '12/30',
        cvv: '123',
        cardholderName: 'JANE DOE',
        amount: 50,
      });

      const { transactionId } = createRes.body;

      const getRes = await request(app.getHttpServer()).get(`/v1/payments/${transactionId}`);
      expect(getRes.status).toBe(200);
      expect(getRes.body.transactionId).toBe(transactionId);
      expect(getRes.body.amount).toBe(50);
    }, 30_000);
  });
});
