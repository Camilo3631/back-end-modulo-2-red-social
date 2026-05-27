import { Router } from "express";

const router = Router();

//Mostrar los chats
router.get('/', async (req, res) => {

    const chats = await req.app.locals.db.collection("chats").find().toArray();

    res.json(chats);
})

//Mostrar los mensajes
router.get('/mensajes', async (req, res) => {
    

    res.json(mensajes)

})

//Registar chats
router.post('/ ', async (req, res) => {


    
})





router.delete('/eliminar-chat', async (req, res) => {

})









export default router;