import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Restaurant by Cooking CORP.",
            version: "1.0.0",
            description: "Documentation de l'API"
        }
    },
    apis: ["./src/routes/*.js", "./src/controllers/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export const swaggerDocs = (app) => {
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
