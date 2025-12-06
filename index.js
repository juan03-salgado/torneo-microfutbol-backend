import express from "express";
import cors from "cors";
import "./db.js";
import usuariosRoutes from "./Routes/usuariosRoutes.js"
import equiposRoutes from "./Routes/equiposRoutes.js";
import jugadoresRoutes from "./Routes/jugadoresRoutes.js";
import torneoRoutes from "./Routes/torneoRoutes.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/uploads", express.static("uploads"));
app.use("/usuarios", usuariosRoutes);
app.use("/equipos", equiposRoutes);
app.use("/jugadores", jugadoresRoutes);
app.use("/torneos", torneoRoutes)


app.listen(4000, () => {
    console.log("El servidor esta corriendo en el puerto 4000");
});