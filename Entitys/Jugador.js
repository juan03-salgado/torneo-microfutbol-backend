import mongoose from "mongoose";

const jugadorSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },

    cedula: {
        type: String,
        required: true,
        unique: true,
    },

    fechaNacimiento: {
        type: Date,
        required: true
    },

    tipoJugador: {
        type: String,
        required: true,
        enum: ["Habitante", "Propietario", "Policia", "Docente-Dorado", "Docente-Vallejo"]
    },

    numero: {
        type: Number,
        min: 1,
        max: 20,
        required: true,
    },

    foto: {
        type: String
    },

    documentos: {
        type: [String]
    },

    equipoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Equipo",
        required: true
    },

    estado: {
        type: String,
        enum: ["Pendiente", "Validado", "Rechazado"],
        default: "Pendiente"
    },

    motivoRechazo: {
        type: String,
        default: null
    },

    delegadoJugador: {
        type: Boolean,
        default: false
    },

    fechaCreacion: {
        type: Date,
        default: Date.now
    }
});

jugadorSchema.set("toJSON", {
    transform: (doc, ret) => {
        delete ret.__v
    }
});

const Jugador = mongoose.model("Jugador", jugadorSchema);
export default Jugador;