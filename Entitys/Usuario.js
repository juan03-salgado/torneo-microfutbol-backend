import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    contrasena: {
        type: String,
        required: true
    },

    rol: {
        type: String,
        enum: ["Administrador", "Delegado"],
        default: "Delegado"
    },

    fechaCreacion: {
        type: Date,
        default: Date.now
    }
});

usuarioSchema.set("toJSON", {
    transform: (doc, ret) => {
        delete ret.__v
    }
});

const Usuario = mongoose.model("Usuario", usuarioSchema);
export default Usuario;