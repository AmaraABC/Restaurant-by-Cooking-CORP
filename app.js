import express from "express";
import cors from "cors";
import swagerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger.js";
import userRouter from "./src/routes/user.routes.js";
import reservationRouter from "./src/routes/reservation.routes.js";
import commandeRouter from "./src/routes/commande.routes.js";
import tableRouter from "./src/routes/table.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api-docs", swagerUi.serve, swagerUi.setup(swaggerSpec));
app.use("/users", userRouter);
app.use("/reservations", reservationRouter);
app.use("/commandes", commandeRouter);
app.use("/tables", tableRouter);


app.get("/", (req, res) => {
  res.send("Welcome to Restaurant by Cooking CORP API");
});

export default app;

