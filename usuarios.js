import { Router } from "express";
import bcrypt from "bcrypt";

const router = Router();

router.get("/", async (req, res) =>{
  const usuarios = await req.app.locals.db.collection("usuarios").find().toArray()

  res.send({data: usuarios})
})

router.post("/registrar", async (req, res) => {
  const datosUsuario = req.body;
  const username = (datosUsuario.username);
  const email = (datosUsuario.email);
  const contrasena = datosUsuario.contrasena;
  let mensaje = ""
  let nuevoUsuario

  //Verificaciones
  //Campos obligados
  if (!username || !email || !contrasena) {
    mensaje = "Todos los campos son obligatorios."
  }
  //formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    mensaje = "Formato de correo inválido."
  }
  //formato de username
  if (username.length < 3 || /[^a-zA-Z0-9_]/.test(username)) {
    mensaje = "El nombre de usuario debe tener mínimo 3 caracteres y solo puede contener letras, números y guión bajo."
  }

  //Cifrar contraseña
  const saltRounds = 12;
  const contrasenaCifrada = await bcrypt.hash(contrasena, saltRounds);


  //Buscar existencia de username y/o email
  const usernameExiste = await req.app.locals.db.collection("usuarios").findOne({username})
  console.log(usernameExiste)
  const emailExiste = await req.app.locals.db.collection("usuarios").findOne({email});


  //Username e email existe 
  if (usernameExiste && emailExiste) {
    mensaje = "Ese nombre de usuario está en uso y ya existe una cuenta con ese correo electrónico."
  }
  //Username existe e email no existe
  if (usernameExiste && !emailExiste) {
    mensaje = "Ese nombre de usuario está en uso."
  }
  //Username no existe e email existe
  if (!usernameExiste && emailExiste) {
    mensaje = "Ya existe una cuenta con ese correo electrónico."
  }

  //Agregar usuario
  if (!usernameExiste && !emailExiste) {
  nuevoUsuario = await req.app.locals.db.collection("usuarios").insertOne(datosUsuario)
  mensaje = "Usuario registrado" 
  }

  res.send({data: nuevoUsuario, mensaje: mensaje})
});



//Iniciar sesion
  router.post("/iniciar-sesion", async (req, res) =>{
    const datosUsuario = req.body;
    let mensaje;
    let emailExiste;
    let estado;
    const passwordMatch = await bcrypt.compare(datosUsuario.contrasena, );

    if (!datosUsuario.email || !datosUsuario.contrasena) {
      mensaje: "Correo/usuario y contraseña son obligatorios.";
      estado = null
    }

    if (!datosUsuario.email || !datosUsuario.contrasena) {
      emailExiste = await req.app.locals.db.collection("usuarios").findOne(datosUsuario)
      emailExiste ? estado = true : estado = false

      if (!passwordMatch) {
        message = "Contraseña incorrecta.";
      }


    }

    res.send({data: usuarioExiste, estado: estado, mensaje: mensaje})
  })


  
  //--BUSCADOR USUARIOS--
  
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
  
  export default router;


  // router.post("/login"), async (req, res) => {
  //   const { identifier, password } = req.body;
  
  // if (!identifier || !password) {
  //     return res.status(400).json({ message: "Correo/usuario y contraseña son obligatorios." });
  //   }
  
  // // -- Buscar por email o username --
  //     const user = await usuarios.findOne({
  //       $or: [
  //         { email: identifier.toLowerCase() },
  //         { username: identifier.toLowerCase() },
  //       ],
  //     });
   
  //     if (!user) {
  //       return res.status(401).json({ message: "Usuario incorrecto." });
  //     }
  
      // -- Comparar contraseña cifrada --
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: "Contraseña incorrecta." });
      }
  //   }