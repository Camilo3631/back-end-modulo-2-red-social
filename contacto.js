import { Router } from "express";
import { ObjectId } from "mongodb";


const router = Router();

// Todos los contactos
router.get('/:username', async (req, res) => {
    const username = req.params.username;

    try {

        const contactos = await req.app.locals.db
          .collection('contactos')
          .find({$or: [{username_contacto1: username}, {username_contacto2: username}]}).toArray()

          res.json(contactos)   

    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener contactos'
        });
    }  
});

// Agregar contacto a la lista
router.post('/agregar-contacto', async (req, res) => {
    try {
       const nuevoContacto = req.body;

       const result = await req.app.locals.db
       .collection('contactos')
       .insertOne(nuevoContacto);

       res.json({
          message: 'Contacto ha sido creado',
          id: result.insertedId
       });
      
   } catch (error) {
       res.status(500).json({
           message: 'Error al crear el contacto'
       });
   }

});



router.delete('/eliminar-contacto/:id', async (req, res) => {
    try {
        const db = req.app.locals.db;
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
             return res.status(400).json({
                 message: 'El ID que se ha preporcionado es incorrecto'
             });
         }

         const result = await db.collection('contactos').deleteOne({
             _id: new ObjectId(id)
         });

         if (result.deletedCount === 0) {
            return res.status(404).json({
                message: 'No se encontró ningún contacto con ese ID'
            });
         }

         res.json({
            message: 'Contacto elimindo correctamente'
         });

      } catch (error) {
         res.status(500).json({
            message: 'Error al eliminar el contacto'
         });
      }
});

router.get('/buscar-contacto', async (req, res) => {
      try {
        const contact = req.query.contact;

        if (!contact || contact.trim() === '') {
             return res.json([]);
        }

        const regex = new RegExp(contact.trim(), 'i');

        const resultados = await req.app.locals.db.collection('contactos')
              .find({
                $or: [
                    { usuario1: regex },
                    { usuario2: regex }
                ]
            })
            .limit(5)
            .toArray();

            res.json(resultados);

           } catch (error) {
            res.status(500).json({
            message: 'Error al buscar recomendaciones'
          });
    }
})








export default router;