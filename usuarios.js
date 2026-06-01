import { Router } from "express";
import bcrypt from "bcrypt"
// propiesta
import { ObjectId } from "mongodb";

const router = Router();



router.get("/", async (req, res) => {

const usuarios = req.app.locals.db.collection("usuarios").find().toArray();

res.send(usuarios)

})


router.post("/registrar", async (req, res) => {

  const datosUsuario = req.body;

  const username = datosUsuario.username;
  const email = datosUsuario.email;
  const contrasena = datosUsuario.contrasena;

  let mensaje = "";
  let nuevoUsuario;

  // Campos obligatorios
  if (!username || !email || !contrasena) {

    mensaje = "Todos los campos son obligatorios.";

  } else {

    // Formato email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      mensaje = "Formato de correo inválido.";
    }

    // Formato username
    else if (
      username.length < 3 ||
      /[^a-zA-Z0-9_]/.test(username)
    ) {

      mensaje =
        "El nombre de usuario debe tener mínimo 3 caracteres y solo puede contener letras, números y guión bajo.";

    } else {

      // Buscar existencia
      const usernameExiste = await req.app.locals.db
        .collection("usuarios")
        .findOne({ username });

      const emailExiste = await req.app.locals.db
        .collection("usuarios")
        .findOne({ email });

      if (usernameExiste && emailExiste) {
        mensaje =
          "Ese nombre de usuario está en uso y ya existe una cuenta con ese correo electrónico.";

      } else if (usernameExiste) {
        mensaje = "Ese nombre de usuario está en uso.";

      } else if (emailExiste) {
        mensaje =
          "Ya existe una cuenta con ese correo electrónico.";

      } else {

        // Cifrar contraseña
        const saltRounds = 12;
        const contrasenaCifrada =
          await bcrypt.hash(contrasena, saltRounds);
          
        //Registrar usuario
        nuevoUsuario = await req.app.locals.db
          .collection("usuarios")
          .insertOne({
            username,
            email,
            contrasena: contrasenaCifrada
          });

        mensaje = "Usuario registrado";
      }
    }
  }

  res.send({data: nuevoUsuario, mensaje});

});



//Iniciar sesion
router.post("/iniciar-sesion", async (req, res) => {
  const datosUsuario = req.body;
  console.log(datosUsuario);
  let mensaje;
  let estado;

  let usuarioVerificado = await req.app.locals.db
    .collection("usuarios")
    .findOne({ email: datosUsuario.email });
  console.log(usuarioVerificado);

  if (!datosUsuario.email || !datosUsuario.contrasena) {
    mensaje = "Email y contraseña son obligatorios para iniciar sesión.";
    estado = false;
  } else {
    const passwordMatch = usuarioVerificado
      ? await bcrypt.compare(
          datosUsuario.contrasena,
          usuarioVerificado.contrasena,
        )
      : false;
    console.log(passwordMatch);

    ({ estado, mensaje } =
      usuarioVerificado && passwordMatch
        ? { estado: true, mensaje: "Usuario verificado" }
        : { estado: false, mensaje: "Credenciales incorrectas" });
  }

  res.send({ estado, mensaje, usuarioVerificado });
});






// Te va mejor un get que un post para esto porque es una consulta no una creación.
router.post("/buscar", async (req, res) => {
  const buscarUser = await req.app.locals.db
    .collection("usuarios")
    .find({
      username: {
        $regex: req.body.name,
        $options: "i",
      },
    })
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