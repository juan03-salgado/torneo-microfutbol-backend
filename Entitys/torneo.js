import mongoose from "mongoose";

const faseSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    }, 
    
    tipo: { 
        type: String, 
        enum: ["Liga","Grupos","Eliminacion"] 
    },

    equipos: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Equipo" 
    }],

    calendario: [{ 
        fecha: Date, 
        equipoA: String, 
        equipoB: String 
    }]
});

const torneoSchema = new mongoose.Schema({
    nombre: String,
    fases: [faseSchema],
    fechaCreacion: { type: Date, default: Date.now }
});

torneoSchema.set("toJSON", {
    transform: (doc, ret) => {
        delete ret.__v
    }
});

export default mongoose.model("Torneo", torneoSchema);