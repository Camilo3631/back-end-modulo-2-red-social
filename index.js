import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import dotenv from "dotenv";
import usuarios from "./usuarios.js";
import publicaciones from "./publicaciones.js";
import contacto from "./contacto.js";
import chat from "./chat.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000


app.use(cors({
  origin: true
}));


app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/usuarios", usuarios);
app.use("/publicaciones", publicaciones);
app.use("/contactos", contacto);
app.use("/chat", chat);


if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Local server running in port: ${PORT}`);
  });
}

await connectDB();

//vercel: db = mongodb+srv://general:general1@cluster0.84ay04h.mongodb.net/?appName=Cluster0
//.env: db = mongodb://admin:admin123@127.0.0.1:27017
async function connectDB() {
  const url = process.env.db;
  const client = await MongoClient.connect(url);
  app.locals.db = client.db("social");
  console.log("mongo connected to", url);

}

export default app;