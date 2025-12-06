import mongoose from "mongoose";

const equipoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },

    delegadoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true,
    },

    fechaCreacion: {
        type: Date,
        default: Date.now
    },

    torneoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Torneo",
        default: null
    }
});

equipoSchema.set("toJSON", {
    transform: (doc, ret) => {
        delete ret.__v
    }
});

const Equipo = mongoose.model("Equipo", equipoSchema);
export default Equipo;