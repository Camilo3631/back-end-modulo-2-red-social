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
    res.status(409).json({ mensaje: "Ese nombre de usuario ya está en uso." });
  }
  //Buscar usuario por email existe
  const emailExiste = await req.app.locals.db.collection("usuarios").findOne({email});
  if (emailExiste) {
    res.status(409).json({ mensaje: "Ya existe una cuenta con ese correo electrónico." });
  }


  //Verificaciones
  //Campos obligados
  if (!username || !email || !contrasena) {
    res.status(400).json({ mensaje: "Todos los campos son obligatorios." });
  }
  //formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ mensaje: "Formato de correo inválido." });
  }
  //formato de username
  if (username.length < 3 || /[^a-zA-Z0-9_]/.test(username)) {
    res.status(400).json({ mensaje: "El nombre de usuario debe tener mínimo 3 caracteres y solo puede contener letras, números y guión bajo." });
  }

  //Agregar usuario
  const nuevoUsuario = await req.app.locals.db.collection("usuarios").insertOne(datosUsuario)

  res.send({data: nuevoUsuario})
});

//--Buscador usuarios--

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

//////////////////////////////////