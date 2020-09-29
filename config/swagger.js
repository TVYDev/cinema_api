const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swagger = (app) => {
    //Reference: https://swagger.io/specification/#info-object
    const swaggerOptions = {
        openapi: '3.0.0',
        definition: {
            info: {
                title: 'Movieer API',
                version: 'v1',
                description:
                    'API for cinemas, halls, movies, tickets management'
            },
            host: 'https://movieer.knowlegdecampground.com/api/v1'
        },
        apis: ['./controllers/*.js']
    };

    const swagerDocs = swaggerJsDoc(swaggerOptions);

    app.use('/api-docs/v1', swaggerUi.serve, swaggerUi.setup(swagerDocs));
};

module.exports = swagger;
