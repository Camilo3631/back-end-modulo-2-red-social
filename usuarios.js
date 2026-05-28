import { Router } from "express";
// propiesta
import { ObjectId } from "mongodb";

const router = Router();










// Modificar cuenta 
router.put('/modificar-cuenta/:id', async (req, res ) => {
    try {
      
        const userId = req.params.id

        const { nombre, apellido, usuario, contraseña} = req.body;


        // Validamos un campo
        if (!nombre &&  !apellido && !usuario && !contraseña) {
            return res.status(400).json({
                message: 'Debes enviar un campo al menos para ser actualizado'
            });
        }

        // Se colocan los datos actualizados 
        const datosActualizados = {};
 
        if (nombre) datosActualizados.nombre = nombre;
        if (apellido) datosActualizados.apellido = apellido;
        if (usuario) datosActualizados.usuario= usuario;
        if (contraseña) datosActualizados.contraseña = contraseña;

        const result = await req.app.locals.db.collection('usuario').updateOne(
            { _id: new ObjectId(userId) },
            { $set: datosActualizados }
        );

        res.status(200).json({
           mensaje: "Ha sido actualizada la cuenta correctamente",
           result
        })

    } catch (error) {
        res.status(500).json({
            error: 'Error al actualizar la cuenta',
        })
    }
});


// Eliminar cuenta
router.delete('/eliminar-cuenta/:id', async (req, res) => {
    try {

        const userId = req.params.id

        const eliminar = await req.app.locals.db.collection('usuario').deleteOne(
            {_id: new ObjectId(userId)}   
        );

        res.json({ message: 'Cuenta eliminada', eliminar});
     } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la cuenta' });
     }
    
});



export default router;