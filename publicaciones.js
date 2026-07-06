import { Router } from "express";

const router = Router();


router.get("/todas", async (req, res) => {
  const publicaciones = await req.app.locals.db
    .collection("publicaciones")
    .find()
    .toArray();
  res.send({ data: publicaciones });
});

router.get("/perfil/:username", async (req, res) => {
  const username = req.params.username;

  const publicaciones = await req.app.locals.db
    .collection("publicaciones")
    .find({ username: username })
    .toArray();

  res.send({ data: publicaciones });
});


router.post("/crear-publicacion", async (req, res) => {
  const nuevaPublicacion = req.body;

  const publicacionCreada = await req.app.locals.db
    .collection("publicaciones")
    .insertOne({
      username: nuevaPublicacion.username,
      texto: nuevaPublicacion.texto,
    });

  res.send({ data: publicacionCreada });
});


export default router;
