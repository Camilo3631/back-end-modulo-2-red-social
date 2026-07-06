import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const chats = await req.app.locals.db.collection("chat").find().toArray();

    res.json(chats);
  } catch (error) {
    res.status(500).json({
      message: "Errro al obtener todos los chats",
    });
  }
});

router.get("/mostrar-mensajes/:userLog/:userConct", async (req, res) => {
  try {
    const { userLog, userConct } = req.params;
    const mensajes = await req.app.locals.db
      .collection("chat")
      .find({
        $or: [
          {
            emisor: userLog,
            receptor: userConct,
          },
          {
            emisor: userConct,
            receptor: userLog,
          },
        ],
      })
      .toArray()
    res.json(mensajes);
  } catch (error) {
    res.status(500).json({
      menssage: "Error al obtener tods los mensajes",
    });
  }
});

router.post("/registrar-mensaje", async (req, res) => {
  try {
    const nuevoMensaje = {
      emisor: req.body.emisor,
      receptor: req.body.receptor,
      mensaje: req.body.mensaje,
      fecha: new Date().toLocaleString(),
    };

    const resultado = await req.app.locals.db
      .collection("chat")
      .insertOne(nuevoMensaje);

    res.json({
      message: "Mensaje registrado exitosamente",
      resultado,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al registrar el mensaje",
    });
  }
});

router.delete("/eliminar-chat", async (req, res) => {
  try {
    const { usuario1, usuario2 } = req.body;

    const eliminarChat = await req.app.locals.db
      .collection("chat")
      .deleteMany({
        $or: [
          {
            emisor: usuario1,
            receptor: usuario2,
          },
          {
            emisor: usuario2,
            receptor: usuario1,
          },
        ],
      });

    res.json({
      message: "Chat eliminado exitosamente",
      eliminarChat,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar el chat",
    });
  }
});

export default router;
