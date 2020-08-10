import request from 'supertest'
import app from '../config/app'

describe('CORS Middleware', () => {
  test('Should enable as request', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Eric Silva',
        email: 'ericsilvaccp@gmail.com',
        password: '123',
        passwordConfirmation: '123'
      })
      .expect(200)
  })
})
