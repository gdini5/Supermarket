const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Marketplace API',
      version: '1.0.0',
      description: 'REST API para o frontoffice Angular do Marketplace de Supermercados Locais. PAW — ESTG/P.Porto',
    },
    servers: [{ url: 'http://localhost:3000/api/v1', description: 'Desenvolvimento' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Mensagem de erro.' },
          },
        },
        User: {
          type: 'object',
          properties: {
            _id:     { type: 'string' },
            name:    { type: 'string' },
            email:   { type: 'string', format: 'email' },
            role:    { type: 'string', enum: ['client', 'supermarket', 'courier', 'admin'] },
            address: { type: 'string' },
            phone:   { type: 'string' },
            active:  { type: 'boolean' },
          },
        },
        Product: {
          type: 'object',
          properties: {
            _id:           { type: 'string' },
            name:          { type: 'string' },
            description:   { type: 'string' },
            category:      { type: 'string' },
            price:         { type: 'number' },
            priceUnit:     { type: 'string', enum: ['un.', 'kg', 'lt', 'cx'] },
            stock:         { type: 'integer' },
            image:         { type: 'string' },
            supermarketId: { type: 'object' },
            active:        { type: 'boolean' },
          },
        },
        Supermarket: {
          type: 'object',
          properties: {
            _id:             { type: 'string' },
            name:            { type: 'string' },
            description:     { type: 'string' },
            address:         { type: 'string' },
            schedule:        { type: 'string' },
            deliveryMethods: { type: 'array', items: { type: 'object' } },
            approved:        { type: 'boolean' },
            active:          { type: 'boolean' },
          },
        },
        Order: {
          type: 'object',
          properties: {
            _id:            { type: 'string' },
            clientId:       { type: 'object' },
            supermarketId:  { type: 'object' },
            courierId:      { type: 'object' },
            items:          { type: 'array', items: { type: 'object' } },
            total:          { type: 'number' },
            deliveryMethod: { type: 'string', enum: ['pickup', 'courier'] },
            deliveryCost:   { type: 'number' },
            status:         { type: 'string', enum: ['pending', 'confirmed', 'preparing', 'delivering', 'delivered', 'cancelled'] },
            confirmedAt:    { type: 'string', format: 'date-time' },
          },
        },
        Category: {
          type: 'object',
          properties: {
            _id:    { type: 'string' },
            name:   { type: 'string' },
            active: { type: 'boolean' },
          },
        },
        PaginatedProducts: {
          type: 'object',
          properties: {
            products: { type: 'array', items: { $ref: '#/components/schemas/Product' } },
            total:    { type: 'integer' },
            page:     { type: 'integer' },
            pages:    { type: 'integer' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./routes/api/*.js'],
};

module.exports = swaggerJsdoc(options);
