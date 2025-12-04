import express from "express";
import cors from "cors";
import estadoxequipoRoutes from "./routes/estadoxequipoRoutes.js";
import db from "./database/db.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/estadoxequipo", estadoxequipoRoutes);

try {
  await db.authenticate();
  console.log("Conexión a la BD exitosa");
} catch (error) {
  console.log("Error BD:", error);
}

app.listen(3001, () => {
  console.log("Servidor corriendo en http://localhost:3001");
});
