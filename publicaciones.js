import { Router } from "express";

const router = Router();

//Mostrar publicaciones del usuario / Pantalla de perfil
router.get("/:username", async (req, res) => {
  const username = req.params.username;

  const publicaciones = await req.app.locals.db
    .collection("publicaciones")
    .find({ username: username })
    .toArray();

  res.send({ data: publicaciones });
});

//Mostrar todas las publicaciones (home)
router.get("/todas", async (req, res) => {
  const publicaciones = await req.app.locals.db
    .collection("publicaciones")
    .find()
    .toArray();
  res.send({ data: publicaciones });
});

//Crear una publicación
router.post("/crear-publicacion", async (req, res) => {
  //El front debe mandar: username y texto (y si quieres la fecha)
  const nuevaPublicacion = req.body;

  const publicacionCreada = await req.app.locals.db
    .collection("publicaciones")
    .insertOne({
      username: nuevaPublicacion.username,
      texto: nuevaPublicacion.texto,
    });

  res.send({ data: publicacionCreada });
});

//Editar publicacion
router.put("/editar-publicacion", async (req, res) => {
  const usuario = req.body.usuario;
  const fecha = req.body.fecha;
  const nuevoTexto = req.body.texto;

  const publicacionEditada = await req.app.locals.db
    .collection("publicaciones")
    .updateOne({ usuario }, { $set: { texto: nuevoTexto, fecha: fecha } });

  res.send({ data: publicacionEditada });
});

export default router;
