import { Router } from "express";

const router = Router();


router.get('/chat', async (req, res) => {

    const chats = await db.find();

    res.json(chats);
})


router.get('/mensajes', async (req, res) => {

    const mensajes = await db.find();

    res.json(mensajes)

})


router.delete('/eliminar-chat', async (req, res) => {



})









export default router;