import { Router } from "express";

const router = Router();



router.post("/register"), async (req, res) => {
const { name, surname, email, username, password } = req.body;}
let client;

    if (!name || !surname || !email || !username || !password) {
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









export default router;