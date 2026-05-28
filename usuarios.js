import { Router } from "express";
import bcrypt from "bcrypt";

const router = Router();

router.post("/registrar", async (req, res) => {
  const datosUsuario = req.body;
  const username = (datosUsuario.username).toLowerCase().trim();
  const email = (datosUsuario.email).toLowerCase().trim();
  const contrasena = datosUsuario.contrasena;
  let mensaje;

  //Cifrar contraseña
  const saltRounds = 12;
  const contrasenaCifrada = await bcrypt.hash(contrasena, saltRounds);

  //Buscar username existe
  const usernameExiste = await req.app.locals.db.collection("usuarios").findOne({username})
  if (usernameExiste) {
    mensaje: "Ese nombre de usuario ya está en uso."
  }
  //Buscar usuario por email existe
  const emailExiste = await req.app.locals.db.collection("usuarios").findOne({email});
  if (emailExiste) {
    mensaje: "Ya existe una cuenta con ese correo electrónico."
  }


  //Verificaciones
  //Campos obligados
  if (!username || !email || !contrasena) {
    res.status(400).json({ mensaje: "Todos los campos son obligatorios." });
  }
  //formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    mensaje: "Formato de correo inválido."
  }
  //formato de username
  if (username.length < 3 || /[^a-zA-Z0-9_]/.test(username)) {
    mensaje: "El nombre de usuario debe tener mínimo 3 caracteres y solo puede contener letras, números y guión bajo."
  }

  //Agregar usuario
  const nuevoUsuario = await req.app.locals.db.collection("usuarios").insertOne(datosUsuario)

  res.send({data: nuevoUsuario})
});







router.post("/login"), async (req, res) => {
  const { identifier, password } = req.body;

if (!identifier || !password) {
    return res.status(400).json({ message: "Correo/usuario y contraseña son obligatorios." });
  }

// -- Buscar por email o username --
    const user = await usuarios.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { username: identifier.toLowerCase() },
      ],
    });
 
    if (!user) {
      return res.status(401).json({ message: "Usuario incorrecto." });
    }

    // -- Comparar contraseña cifrada --
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta." });
    }
  }



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