import Equipo from "../Entitys/Equipo.js";

export const getEquipos = async(req, res) => {
    try {
        const equipos = await Equipo.find().populate("delegadoId", "nombre email").populate("torneoId", "nombre");
        res.json(equipos);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

export const getEquiposId = async(req, res) => {
    try {
        const equipo = await Equipo.findById(req.params.id).populate("delegadoId", "nombre email").populate("torneoId", "nombre")
        
        if(!equipo){
            return res.status(404).json({message: "Equipo no encontrado"});
        }
        res.json(equipo);
    } catch (error) {
        res.status(500).json({error: error.message});       
    }
};

export const getDelegadoEquipo = async(req, res) => {
    try {
        const equipo = await Equipo.findOne({delegadoId: req.params.delegadoId}).populate("delegadoId", "nombre").populate("torneoId", "nombre");

        if(!equipo){
            return res.status(404).json({message: "El delegado no tiene un equipo asignado"});
        }

        res.json(equipo);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

export const crearEquipo = async(req, res) => {
    try {
        const {nombre, delegadoId ,torneoId} = req.body;

        const equipo = new Equipo({nombre, delegadoId, torneoId});
        await equipo.save();
        res.json({message: "Equipo creado con exito", equipo});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

export const actualizarEquipo = async(req, res) => {
    try {
        const equipo = await Equipo.findByIdAndUpdate(req.params.id, req.body, {new: true});

        if(!equipo){
            return res.status(404).json({ message: "Equipo no encontrado"})
        }
        res.json({message: "Equipo actualizado con exito", equipo});

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const inscribirEquipo = async(req, res) => {
    try{
        const { torneoId } = req.body;

    if (!torneoId) {
      return res.status(400).json({ message: "torneoId es obligatorio" });
    }

    const equipoActualizado = await Equipo.findByIdAndUpdate(req.params.id, { torneoId }, { new: true }).populate("torneoId");

    if (!equipoActualizado) {
      return res.status(404).json({ message: "Equipo no encontrado" });
    }

    res.json(equipoActualizado);

    } catch(error){
        res.status(500).json({ error: error.message });
    }
}

export const eliminarEquipo = async(req, res) => {
    try {
        const equipo = await Equipo.findByIdAndDelete(req.params.id);

        if(!equipo) {
            return res.status(404).json({message: "Equipo no encontrado"});
        }
        res.json({ message: "Equipo eliminado con exito"});
    
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}



