import Usuario from "../Entitys/Usuario.js"

export const getUsuarios = async(req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.json(usuarios);
    } catch (error){
        res.status(500).json({error: error.message});
    }
};

export const getUsuariosId = async(req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);

        if(!usuario){
            return res.status(404).json({message: "Usuario no encontrado"})
        };
        res.json(usuario);

    } catch (error){
        res.status(500).json({error: error.message});
    }
};

export const crearUsuario = async(req, res) => {
    try {
        const usuario = new Usuario(req.body);
        await usuario.save();
        res.status(201).json({ mensaje: "Usuario creado con exito", usuario});
        
    } catch (error){
        res.status(500).json({ error: error.message})
    }
};

export const actualizarUsuario = async(req, res) => {
    try {
        const usuario = await Usuario.findByIdAndUpdate(req.params.id, req.body, {new: true});
        
        if(!usuario){
            return res.status(404).json({ message: "Usuario no encontrado"})
        }
        res.json({message: "Usuario actualizado con exito", usuario});

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const eliminarUsuario = async(req, res) => {
    try {
        const usuario = await Usuario.findByIdAndDelete(req.params.id);

        if(!usuario) {
            return res.status(404).json({message: "Usuario no encontrado"});
        }
        res.json({ message: "Usuario eliminado con exito"});

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const loginUsuario = async(req, res) => {
    try {
        const { nombre, contrasena } = req.body;

        if(!nombre || !contrasena){
            return res.status(400).json({ message: "Faltan credenciales"});
        }

        if(nombre === "Admin" && contrasena === 'password'){
            return res.json({ message: "Login exitoso", usuario: {id: 1, nombre: "Admin", email: "admin@gmail.com", rol: "Administrador"}});
        }

        const usuario = await Usuario.findOne({ nombre, contrasena});

        if(!usuario){
            return res.status(404).json({ message: "El usuario no existe"})
        }

        res.json({ message: "Login exitoso", usuario: { id: usuario._id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol}});

    } catch(error){
        return res.status(500).json({ error: error.message });
    }
}




