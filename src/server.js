import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/auth.routes.js";
import userRoute from "./routes/user.routes.js";
import tableReservationRoutes from "./routes/tableReservation.routes.js";
import reservationRoutes from "./routes/reservation.routes.js";
import ordersRoutes from "./routes/orders.routes.js";
import platRoutes from "./routes/plat.routes.js";
import swagerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

app.use("/auth", authRoutes);
app.use("/users", userRoute);
app.use("/tables", tableReservationRoutes);
app.use("/reservations", reservationRoutes);
app.use("/orders", ordersRoutes);
app.use("/dishes", platRoutes);
app.use("/docs", swagerUi.serve, swagerUi.setup(swaggerSpec));

app.listen(process.env.PORT || 3000, () =>
  console.log(`Serveur lancé sur le port ${process.env.PORT || 3000}`)
);

app.get("/", (req, res) => {
  res.send("Welcome to Restaurant by Cooking CORP !");
});

export default app;