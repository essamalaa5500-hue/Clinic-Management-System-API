const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Clinic Management System API",
      version: "1.0.0",
      description:
        "REST API documentation for the Clinic Management System backend.",
      contact: {
        name: "Essam Alaa",
        email: "essamalaa5500@gmail.com",
      },
      license: {
        name: "MIT",
      },
    },

    servers: [
      {
        url: "https://essam-clinic-management-system-api.bonto.run",
        description: "Production Server",
      },
      {
        url: "http://localhost:6000",
        description: "Local Development Server",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },

    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: ["./docs/*SwaggerDoc.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = (app) => {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customSiteTitle: "Clinic-Management-System API Documentation",
    }),
  );
};
