import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJsdoc({
    definition: {
        openapi: "3.0.0",
        info:{
            title : "TP Express",
            version: "1.0.0",
        }
    },
    apis: ["./src/routes/*.js"],
})