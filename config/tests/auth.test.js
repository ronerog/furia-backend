// tests/auth.test.js
const request = require('supertest');
const app = require('../app');
const User = require('../models/User');
const mongoose = require('mongoose');

// Conectar ao banco de dados de teste antes de executar os testes
beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/furia_test');
});

// Limpar coleções e fechar conexão após os testes
afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe('Autenticação', () => {
  // Testar registro de usuário
  test('Deve registrar um novo usuário', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('username', 'testuser');
  });
  
  // Testar login de usuário
  test('Deve autenticar um usuário existente', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('username', 'testuser');
  });
  
  // Testar login com credenciais inválidas
  test('Deve rejeitar credenciais inválidas', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword'
      });
    
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('success', false);
  });
});