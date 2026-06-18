import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validate } from '../../4-framework/middlewares/validate.middleware';

const makeRes = (): Response => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const schema = z.object({
  name: z.string().min(2),
  age: z.number().int().positive(),
});

describe('validate middleware', () => {
  it('calls next() when body is valid', () => {
    const req = { body: { name: 'John', age: 30 } } as Request;
    const res = makeRes();
    const next: NextFunction = jest.fn();

    validate(schema)(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('returns 400 with errors when a required field is missing', () => {
    const req = { body: { age: 30 } } as Request;
    const res = makeRes();
    const next: NextFunction = jest.fn();

    validate(schema)(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Validation error',
        errors: expect.arrayContaining([
          expect.objectContaining({ field: 'name' }),
        ]),
      }),
    );
  });

  it('returns 400 when field fails format validation', () => {
    const req = { body: { name: 'A', age: 30 } } as Request;
    const res = makeRes();
    const next: NextFunction = jest.fn();

    validate(schema)(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns 400 when field has wrong type', () => {
    const req = { body: { name: 'John', age: 'not-a-number' } } as Request;
    const res = makeRes();
    const next: NextFunction = jest.fn();

    validate(schema)(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        errors: expect.arrayContaining([
          expect.objectContaining({ field: 'age' }),
        ]),
      }),
    );
  });

  it('replaces req.body with parsed (coerced) data', () => {
    const req = { body: { name: 'John', age: 30, extra: 'stripped' } } as Request;
    const res = makeRes();
    const next: NextFunction = jest.fn();

    validate(schema)(req, res, next);

    expect(req.body).toEqual({ name: 'John', age: 30 });
  });
});
