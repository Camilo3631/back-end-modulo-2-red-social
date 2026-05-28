import { Router } from "express";

const router = Router();
const usuarios = req.app.locals.db.collection("usuarios");


router.post("/registrar"), async (req, res) => {
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



}

//--Buscador usuarios--

router.post("/buscar", async (req, res) => {
  const buscaruser = await req.app.locals.db
    .collection("usuarios")
    .find({username:{
      $regex: req.body.name,
      $options: "i"
    }})
    .toArray();
  res.send({ data: buscaruser });
});




export default router;