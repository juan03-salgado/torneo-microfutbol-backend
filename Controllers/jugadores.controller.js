import Jugador from "../Entitys/Jugador.js"

export const getJugadores = async(req, res) => {
    try {
        const jugadores = await Jugador.find().populate("equipoId", "nombre");
        res.json(jugadores);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getJugadorId = async(req, res) => {
    try {
        const jugador = await Jugador.findById(req.params.id).populate("equipoId", "nombre");

        if (!jugador) {
            return res.status(404).json({message: "Jugador no encontrado"})
        }
        res.json(jugador);
    } catch (error) {
        return res.status(500).json({ error: error.message});
    }
};

export const getPorEquipo = async(req, res) => {
    try {
        const jugadores = await Jugador.find({ equipoId: req.params.equipoId }).populate("equipoId", "nombre");
        res.json(jugadores)
    } catch (error){
        res.status(500).json({error: error.message});
    }
};

export const getEstado = async(req, res) => {
    try {
        const jugadores = await Jugador.find({ estado: req.params.estado }).populate("equipoId", "nombre");
        res.json(jugadores)
    } catch (error){
        res.status(500).json({error: error.message});
    }
}

export const crearJugador = async(req, res) => {
    try {
        const { nombre, cedula, numero, equipoId, tipoJugador, fechaNacimiento, delegadoJugador } = req.body;

        const foto = req.files?.foto?.[0]?.filename || null;
        const documentos = req.files?.documentos?.map(file => file.filename) || [];

        if (!nombre || !cedula || !numero || !equipoId || !tipoJugador || !fechaNacimiento) {
            return res.status(400).json({ message: "Faltan datos obligatorios" });
        }

        const existeCedula = await Jugador.findOne({ cedula });
        if (existeCedula){
            return res.status(400).json({ message: "La cedula ya existe" });
        } 

        const numeroRepetido = await Jugador.findOne({ equipoId, numero });
        if (numeroRepetido){
            return res.status(400).json({ message: "El numero ya esta usado en este equipo" });
        } 

        const totalJugadores = await Jugador.countDocuments({ equipoId });
        if (totalJugadores >= 16){
            return res.status(400).json({ message: "El equipo ya tiene 16 jugadores" });
        } 

        if (tipoJugador === "Docente-Dorado" && await Jugador.countDocuments({ equipoId, tipoJugador }) >= 2) {
            return res.status(400).json({ message: "Máximo 2 Docentes I.E. El Dorado" });
        }

        if (tipoJugador === "Docente-Vallejo" && await Jugador.countDocuments({ equipoId, tipoJugador }) >= 2) {
            return res.status(400).json({ message: "Máximo 2 Docentes/Padres Fundación Vallejo" });
        }

        if (tipoJugador === "Policia" && await Jugador.countDocuments({ equipoId, tipoJugador: "Policia" }) >= 3) {
            return res.status(400).json({ message: "Máximo 3 policías" });
        }

        if (tipoJugador === "Extranjeros") {
            const edad = new Date().getFullYear() - new Date(fechaNacimiento).getFullYear();
            if (edad < 26) return res.status(400).json({ message: "Extranjeros deben tener al menos 26 años" });
        }

        const jugador = new Jugador({nombre, cedula, numero, equipoId, tipoJugador, fechaNacimiento, delegadoJugador: delegadoJugador === "true" || delegadoJugador === true, foto, documentos, estado: "Pendiente", motivoRechazo: null, fechaCreacion: new Date().toISOString()});

        await jugador.save();
        res.json({ message: "Jugador creado con éxito", jugador });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

export const actualizarJugador = async(req, res) => {
    try {
        const { nombre, cedula, numero, equipoId, tipoJugador, fechaNacimiento, delegadoJugador } = req.body;

        const jugadorActual = await Jugador.findById(req.params.id);
        if (!jugadorActual){
            return res.status(404).json({ message: "Jugador no encontrado" });
        } 

        if (numero && equipoId) {
            const repetido = await Jugador.findOne({ _id: { $ne: req.params.id }, equipoId, numero });
            if (repetido) return res.status(400).json({ message: "Ese numero ya está usado en este equipo" });
        }

        if (tipoJugador && equipoId) {
            if (tipoJugador === "Docente-Dorado" &&
                await Jugador.countDocuments({ equipoId, tipoJugador }) >= 2 && jugadorActual.tipoJugador !== tipoJugador) {
                return res.status(400).json({ message: "Máximo 2 Docentes I.E. El Dorado" });
            }

            if (tipoJugador === "Docente-Vallejo" &&
                await Jugador.countDocuments({ equipoId, tipoJugador }) >= 2 && jugadorActual.tipoJugador !== tipoJugador) {
                return res.status(400).json({ message: "Máximo 2 Docentes/Padres Fundación Vallejo" });
            }

            if (tipoJugador === "Policia" &&
                await Jugador.countDocuments({ equipoId, tipoJugador: "Policia" }) >= 3 && jugadorActual.tipoJugador !== tipoJugador) {
                return res.status(400).json({ message: "Máximo 3 policías" });
            }

            if (tipoJugador === "Extranjeros") {
                const edad = new Date().getFullYear() - new Date(fechaNacimiento).getFullYear();
                if (edad < 26){
                    return res.status(400).json({ message: "Extranjeros deben tener al menos 26 años" });
                } 
            }
        }

        jugadorActual.nombre = nombre || jugadorActual.nombre;
        jugadorActual.cedula = cedula || jugadorActual.cedula;
        jugadorActual.numero = numero || jugadorActual.numero;
        jugadorActual.equipoId = equipoId || jugadorActual.equipoId;
        jugadorActual.tipoJugador = tipoJugador || jugadorActual.tipoJugador;
        jugadorActual.fechaNacimiento = fechaNacimiento || jugadorActual.fechaNacimiento;
        jugadorActual.delegadoJugador = delegadoJugador === "true" || jugadorActual.delegadoJugador;

        if(req.files?.foto?.length > 0){
            jugadorActual.foto = req.files.foto[0].filename;
        } 

        if(req.files?.documentos?.length > 0) {
            const docs = req.files.documentos.map(f => f.filename);
            jugadorActual.documentos.push(...docs);
        }

        await jugadorActual.save();
        res.json({ message: "Jugador actualizado con éxito", jugador: jugadorActual });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminarJugador = async(req, res) => {
    try {
        const jugador = await Jugador.findByIdAndDelete(req.params.id);

        if(!jugador){
            return res.status(404).json({message: "Jugador no encontrado"});
        }
        res.json({message: "Jugador eliminado con exito"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

export const subirFoto = async(req, res) => {
    try {
        if(!req.file){
            return res.status(400).json({ message: "No se subio ninguna foto"});
        }
        const jugador = await Jugador.findByIdAndUpdate(req.params.id, {foto: req.file.filename}, {new: true});
        res.json({ message: "Foto subida correctamente", jugador})

    } catch (error){
        res.status(500).json({error: error.message});
    }
};

export const subirDocumento = async(req, res) => {
    try {
        if(!req.files || req.files.length === 0){
            return res.status(400).json({ message: "No se subieron los documentos"})
        };

        const docs = req.files.map(file => file.filename);
        const jugador = await Jugador.findByIdAndUpdate(req.params.id, {$push: {documentos: {$each: docs}}}, {new: true});
        res.json({ message: "Documentos subidos correctamente", jugador})

    } catch (error){
        res.status(500).json({error: error.message});
    }
};

export const validarJugador = async(req, res) => {
    try {
        const jugador = await Jugador.findByIdAndUpdate(req.params.id, {estado: "Validado", motivoRechazo: null}, {new: true});
        
        if(!jugador){
            return res.status(404).json({ message: "Jugador no encontrado"})
        };
        res.json({message: "Jugador validado", jugador})

    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

export const rechazoJugador = async(req, res) => {
    try {
        const { motivo } = req.body;
        const jugador = await Jugador.findByIdAndUpdate(req.params.id, {estado: "Rechazado", motivoRechazo: motivo || "No especificado"}, {new: true});
        
        if(!jugador){
            return res.status(404).json({ message: "Jugador no encontrado"})
        };
        res.json({ message: "Jugador rechazado", jugador});

    } catch (error) {
        res.status(500).json({error: error.message});
    }
};