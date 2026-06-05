import { Router } from "express";

const router = Router();

//Mostrar los mensaje
router.get('/', async (req, res) => {

    const chats = await req.app.locals.db.collection("chats").find().toArray();

    res.json(chats);
})

//Registrar mensaje
router.get('/registrar', async (req, res) => {
    

    res.json()

})




export default router;