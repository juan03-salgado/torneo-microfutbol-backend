import Torneo from "../Entitys/torneo.js";
import Equipo from "../Entitys/Equipo.js";

export const getTorneos = async (req, res) => {
    try {
        const torneos = await Torneo.find().populate("fases.equipos", "nombre");
        res.json(torneos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getTorneoId = async (req, res) => {
    try {
        const torneo = await Torneo.findById(req.params.id).populate("fases.equipos", "nombre");
        if (!torneo) return res.status(404).json({ message: "Torneo no encontrado" });
        res.json(torneo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const crearTorneo = async (req, res) => {
    try {
        const torneo = new Torneo({ nombre: req.body.nombre });
        await torneo.save();
        res.status(201).json({ message: "Torneo creado con éxito", torneo });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const agregarFase = async (req, res) => {
    try {
        const { nombre, tipo, equipos } = req.body;

        const equiposId = equipos.map(e => e._id);

        const torneo = await Torneo.findById(req.params.id);
        if (!torneo) return res.status(404).json({ message: "Torneo no encontrado" });

        if (!["Liga", "Grupos", "Eliminacion"].includes(tipo)) {
            return res.status(400).json({ message: "Tipo de fase inválido" });
        }

        const equiposExistentes = await Equipo.find({ _id: { $in: equiposId } });
        if (equiposExistentes.length !== equiposId.length) {
            return res.status(400).json({ message: "Algunos equipos no existen" });
        }

        let calendario = [];
        if (tipo === "Liga" || tipo === "Grupos") {
            for (let i = 0; i < equiposExistentes.length; i++) {
                for (let j = i + 1; j < equiposExistentes.length; j++) {
                    calendario.push({ fecha: null, equipoA: equiposExistentes[i].nombre, equipoB: equiposExistentes[j].nombre });
                }
            }
        }

        const fase = { nombre, tipo, equipos: equiposId, calendario };
        torneo.fases.push(fase);
        await torneo.save();

        await Equipo.updateMany({ _id: { $in: equiposId } },{ torneoId: torneo._id });

        res.json({ message: "Fase agregada con éxito", torneo });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const actualizarFase = async (req, res) => {
  try {
    const { torneoId, faseId } = req.params;

    const torneo = await Torneo.findById(torneoId);
    if (!torneo){
        return res.status(404).json({ message: "Torneo no encontrado" });
    } 

    const fase = torneo.fases.id(faseId);
    if (!fase){
        return res.status(404).json({ message: "Fase no encontrada" });
    } 

    const equiposNuevos = req.body.equipos; 
    const equiposAntiguos = fase.equipos.map(e => e.toString());

    fase.nombre = req.body.nombre;
    fase.tipo = req.body.tipo;
    fase.equipos = equiposNuevos;
    fase.calendario = req.body.calendario || fase.calendario;

    await torneo.save();

    await Equipo.updateMany({ _id: { $in: equiposAntiguos.filter(e => !equiposNuevos.includes(e)) } },{ $unset: { torneoId: "" } });
    await Equipo.updateMany({ _id: { $in: equiposNuevos } }, { torneoId: { _id: torneo._id, nombre: torneo.nombre } });

    res.json({ message: "Fase actualizada con éxito", fase });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const eliminarFase = async (req, res) => {
  try {
    const { torneoId, faseId } = req.params;

    const torneo = await Torneo.findById(torneoId);
    if (!torneo) {
      return res.status(404).json({ message: "Torneo no encontrado" });
    }

    const fase = torneo.fases.id(faseId);
    if (!fase) {
      return res.status(404).json({ message: "Fase no encontrada" });
    }

    const equiposEnFase = fase.equipos.map(e => e.toString());

    torneo.fases = torneo.fases.filter(f => f._id.toString() !== faseId);
    await torneo.save();

    await Equipo.updateMany({ _id: { $in: equiposEnFase } },{ $unset: { torneoId: "" } });

    res.json({ message: "Fase eliminada con éxito" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const generarEliminacion = async (req, res) => {
    try {
        const { torneoId, faseId } = req.params;

        const torneo = await Torneo.findById(torneoId).populate("fases.equipos", "nombre");
        if(!torneo){
            return res.status(404).json({ message: "Torneo no encontrado" });
        }

        const fase = torneo.fases.id(faseId);
        if(!fase){
            return res.status(404).json({ message: "Fase no encontrada" });
        } 

        if(fase.tipo !== "Eliminacion"){
            return res.status(400).json({ message: "Esta fase no es de Eliminación Directa" });
        }

        const equipos = await Equipo.find({ _id: { $in: fase.equipos } }).select("nombre");
        if (equipos.length < 2){
            return res.status(400).json({ message: "No hay suficientes equipos para la eliminación" });
        } 

        const shuffled = [...equipos].sort(() => Math.random() - 0.5);

        const calendario = [];
        let ronda = 1;
        let i = 0;

        while (i < shuffled.length) {
            const equipoA = shuffled[i];
            const equipoB = shuffled[i + 1] || null;

            calendario.push({ronda, fecha: null, equipoA: equipoA.nombre, equipoB: equipoB ? equipoB.nombre : "BYE"});
            i += 2;
        }
        fase.calendario = calendario;
        await torneo.save();

        res.json({ message: "Fase de Eliminacion generada correctamente", fase});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminarTorneo = async (req, res) => {
    try {
        const torneo = await Torneo.findByIdAndDelete(req.params.id);
        if (!torneo){
            return res.status(404).json({ message: "Torneo no encontrado" });
        } 
        res.json({ message: "Torneo eliminado con éxito" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}; 


