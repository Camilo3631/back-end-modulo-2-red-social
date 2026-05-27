import { Router } from "express";

const router = Router();

//Mostrar publicaciones
router.get("/", async (req, res) => {
  const publicaciones = await req.app.locals.db
    .collection("publicaciones")
    .find()
    .toArray();
  res.send({ data: publicaciones });
});

//Crear una publicación
router.post("/crear-publicacion", async (req, res) => {
  const nuevaPublicacion = req.body;
  const publicacionCreada = await req.app.locals.db
    .collection("publicaciones")
    .insertOne(nuevaPublicacion);

  res.send({ data: publicacionCreada });
});

//Editar publicacion
router.put("/editar-publicacion", async (req, res) => {
    const usuario = req.body.usuario;
    const fecha = req.body.fecha;
    const nuevoTexto = req.body.texto;
  const publicacionEditada =
    await req.app.locals.db.collection("publicaciones").updateOne({usuario}, {$set: {texto: nuevoTexto, fecha: fecha}})

    res.send({data: publicacionEditada})
});

export default router;
