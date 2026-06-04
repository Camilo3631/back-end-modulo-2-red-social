import { Router } from "express";

const router = Router();

//Mostrar los chats
router.get('/', async (req, res) => {

    try { 
       const chats = await req.app.locals.db
        .collection("chats")
        .find()
        .toArray()

         res.json(chats);

    } catch (error) {

        res.status(500).json({
            message: 'Errro al obtener todos los chats'
        });
    }
});

//Mostrar los mensajes
router.get('/mostrar-mensajes/:emisor/:receptor', async (req, res) => {

    try {

       const { emisor, receptor} = req.params;

       const mensajes = await req.app.locals.db
       .collection('chats')
       .find({
         $or: [
            {
                emisor: emisor,
                receptor: receptor
            },
            {
                emisor: receptor,
                receptor: emisor
            }
           ]
       })
       .sort({ fecha: 1})
       .toArray();

       res.json(mensajes);
      
    } catch (error) {
        res.status(500).json({
            menssage: 'Error al obtener tods los mensajes'
        });
    }
});

//Registar chats
router.post('/registrar-chats', async (req, res) => {

    try {

          const nuevoMensaje = {
              emisor: req.body.emisor,
              receptor: req.body.receptor,
              mensaje: req.body.mensaje,
              fecha: new Date()
          };

          const resultado = await req.app.locals.db
            .collection('chats')
            .insertOne(nuevoMensaje);

          res.json({
              message: 'Mensaje registrado exitosamente',
              resultado
          });

    } catch (error) {
        res.status(500).json({
            message: 'Error al registrar el mensaje'
        });
    }
});

// Eliminar chat
router.delete('/eliminar-chat', async (req, res) => {

    try {

        const { usuario1, usuario2 } = req.body;

        const eliminarChat = await req.app.locals.db
        .collection('chats')
        .deleteMany({
         $or: [
          {
            emisor: usuario1,
            receptor: usuario2
          },
          {
            emisor: usuario2,
            receptor: usuario1
          }
        ]
       });

    res.json({
        message: 'Chat eliminado exitosamente',
        eliminarChat
    });

   }  catch (error) {
    res.status(500).json({
        message: 'Error al eliminar el chat'
    })

}

});


export default router;