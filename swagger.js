// config/swagger.js
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FURIA API',
      version: '1.0.0',
      description: 'API para o site da FURIA Esports',
      contact: {
        name: 'FURIA',
        url: 'https://furia.gg',
      },
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://api.furia.gg' 
          : 'http://localhost:5000',
        description: process.env.NODE_ENV === 'production' ? 'Produção' : 'Desenvolvimento',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{
      bearerAuth: [],
    }],
  },
  apis: ['./routes/*.js'], // Caminho para os arquivos com anotações
};

const specs = swaggerJsdoc(options);

module.exports = specs;