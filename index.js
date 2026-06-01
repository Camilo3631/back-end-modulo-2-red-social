import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import dotenv from "dotenv"

dotenv.config()

//Importar archivos endpoints
import usuarios from './usuarios.js'
import publicaciones from './publicaciones.js'
import contacto from './contacto.js'
import chat from './chat.js'

const app = express()

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Rutas de archivos
app.use('/usuarios', usuarios);
app.use('/publicaciones', publicaciones);
app.use('/contactos', contacto);
app.use('/chats', chat);


app.listen(process.env.PORT || 3000);

app.get("/", (req, res) =>{
    res.send("api connected")
})

await connectDB()

async function connectDB() {
    console.log(process.env.db)
    const url =  process.env.db;
    const client = await MongoClient.connect(url);
    app.locals.db = client.db("social")

}