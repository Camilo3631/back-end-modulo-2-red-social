import { Router } from "express";
// propiesta
import { ObjectId } from "mongodb";

const router = Router();



router.post("/registrar", async (req, res) => {

const usuarios = req.app.locals.db.collection("usuarios");

const { email, username, password } = req.body;

let client;
const emailExistente = await usuarios.findOne({ email: email.toLowerCase() });
const usernameExistente = await usuarios.findOne({ username: username.toLowerCase() });

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios." })}
    
 // -- 2. Validar formato de email --
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Formato de correo inválido." });
    }
 
    // -- 3. Validar formato de username --
    if (username.length < 3 || /[^a-zA-Z0-9_]/.test(username)) {
      return res.status(400).json({
        message: "El nombre de usuario debe tener mínimo 3 caracteres y solo puede contener letras, números y guión bajo.",
      });
    }
 
    // -- 4. Validar longitud mínima de contraseña --
    if (password.length < 8) {
      return res.status(400).json({ message: "La contraseña debe tener al menos 8 caracteres." });
    }

// -- 5. Comprobar si el email ya existe --
    if (emailExistente) {
      return res.status(409).json({ message: "Ya existe una cuenta con ese correo electrónico." });
    }
    // -- 6. Comprobar si el username ya existe --
    if (usernameExistente) {
      return res.status(409).json({ message: "Ese nombre de usuario ya está en uso." });
    }
    // -- Cifrar contraseña --
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

     // -- Insertar usuario --
    const nuevoUsuario = {
      email: email.toLowerCase().trim(),
      username: username.toLowerCase().trim(),
      password: hashedPassword,
      profilePicture: null,
      followers: [],
      following: [],
      createdAt: new Date(),
    };
 
    const result = await users.insertOne(nuevoUsuario);



})

// Te va mejor un get que un post para esto porque es una consulta no una creación.
router.post("/buscar", async (req, res) => {
  const buscarUser = await req.app.locals.db
    .collection("usuarios")
    .find({username:{
      $regex: req.body.name,
      $options: "i"
    }})
    .toArray();
  res.send({ data: buscarUser });
});






// Modificar cuenta 
router.put('/modificar-cuenta/:id', async (req, res ) => {
    try {
      
        const userId = req.params.id

        const { nombre, apellido, usuario, contraseña} = req.body;


        // Validamos un campo
        if (!nombre &&  !apellido && !usuario && !contraseña) {
            return res.status(400).json({
                message: 'Debes enviar un campo al menos para ser actualizado'
            });
        }

        // Se colocan los datos actualizados 
        const datosActualizados = {};
 
        if (nombre) datosActualizados.nombre = nombre;
        if (apellido) datosActualizados.apellido = apellido;
        if (usuario) datosActualizados.usuario= usuario;
        if (contraseña) datosActualizados.contraseña = contraseña;

        const result = await req.app.locals.db.collection('usuario').updateOne(
            { _id: new ObjectId(userId) },
            { $set: datosActualizados }
        );

        res.status(200).json({
           mensaje: "Ha sido actualizada la cuenta correctamente",
           result
        })

    } catch (error) {
        res.status(500).json({
            error: 'Error al actualizar la cuenta',
        })
    }
});


// Eliminar cuenta
router.delete('/eliminar-cuenta/:id', async (req, res) => {
    try {

        const userId = req.params.id


        const eliminar = await req.app.locals.db.collection('usuario').deleteOne(
            {_id: new ObjectId(userId)}   
        );

        res.json({ message: 'Cuenta eliminada', eliminar});
     } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la cuenta' });
     }
    
});



export default router;