import { Router } from "express";
import bcrypt from "bcrypt";
// propiesta
import { ObjectId } from "mongodb";

const router = Router();

router.get("/", async (req, res) => {
  const usuarios = await req.app.locals.db
    .collection("usuarios")
    .find()
    .toArray();

  res.send(usuarios);
});

router.post("/registrar", async (req, res) => {
  const datosUsuario = req.body;

  const username = datosUsuario.username;
  const email = datosUsuario.email;
  const contrasena = datosUsuario.contrasena;

  let mensaje = "";
  let nuevoUsuario;

  if (!username || !email || !contrasena) {
    mensaje = "Todos los campos son obligatorios.";
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) mensaje = "Formato de correo inválido.";
    if (username.length < 3 || /[^a-zA-Z0-9_]/.test(username)) {
      mensaje =
        "El nombre de usuario debe tener mínimo 3 caracteres y solo puede contener letras, números y guión bajo.";
    } else {
      const usernameExiste = await req.app.locals.db
        .collection("usuarios")
        .findOne({ username });

      const emailExiste = await req.app.locals.db
        .collection("usuarios")
        .findOne({ email });

      if (usernameExiste && emailExiste)
        mensaje =
          "Ese nombre de usuario está en uso y ya existe una cuenta con ese correo electrónico.";
      if (usernameExiste) mensaje = "Ese nombre de usuario está en uso.";
      if (!usernameExiste && !emailExiste) {
        mensaje = "Ya existe una cuenta con ese correo electrónico.";
      } else {
        const saltRounds = 12;
        const contrasenaCifrada = await bcrypt.hash(contrasena, saltRounds);

        nuevoUsuario = await req.app.locals.db
          .collection("usuarios")
          .insertOne({
            username,
            email,
            contrasena: contrasenaCifrada,
          });
        mensaje = "Usuario registrado correctamente";
      }
    }
  }
  res.send({ data: nuevoUsuario, mensaje });
});

router.post("/iniciar-sesion", async (req, res) => {
  const datosUsuario = req.body;
  let mensaje;
  let estado;

  let usuarioVerificado = await req.app.locals.db
    .collection("usuarios")
    .findOne({ email: datosUsuario.email });

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

    ({ estado, mensaje } =
      usuarioVerificado && passwordMatch
        ? { estado: true, mensaje: "Usuario verificado" }
        : { estado: false, mensaje: "Credenciales incorrectas" });
  }

  res.send({ estado, mensaje, usuarioVerificado });
});

router.post("/buscar", async (req, res) => {
  const buscarUser = await req.app.locals.db
    .collection("usuarios")
    .find({
      username: {
        $regex: req.body.username,
        $options: "i",
      },
    })
    .toArray();
  res.send({ data: buscarUser });
});

router.put("/modificar-cuenta/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const user = req.body;
    if (!user.name && !user.username && !user.contrasena) {
      return res.status(400).json({
        message: "Debes enviar un campo al menos para ser actualizado",
      });
    }

    const saltRounds = 12;
    const contrasenaCifrada = await bcrypt.hash(user.contrasena, saltRounds);

    const result = await req.app.locals.db
      .collection("usuarios")
      .updateOne(
        { email: email },
        { $set: { username: user.username, contrasena: contrasenaCifrada } },
      );

    res.status(200).json({
      mensaje: "Ha sido actualizada la cuenta correctamente",
      result,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al actualizar la cuenta",
    });
  }
});

// Eliminar cuenta
router.post("/eliminar-cuenta/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const eliminar = await req.app.locals.db
      .collection("usuarios")
      .deleteOne({ email: email });

    res.send({ message: "Cuenta eliminada", eliminar: eliminar });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la cuenta" });
  }
});

export default router;
