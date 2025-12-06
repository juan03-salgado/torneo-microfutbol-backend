import mongoose from "mongoose";

const url = "mongodb://localhost:27017/torneo";

mongoose.connect(url)
.then(() => console.log("Conectado a mongoDB"))
.catch((error) => console.error("Error al conectar a mongoDB", error));

export default mongoose;
