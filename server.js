import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";

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
app.use('/contacto', contacto);
app.use('/chat', chat);


app.listen(process.env.PORT || 3000);

//const url= `mongodb+srv://karlaperezn96_db_user:EnUnLugar...@cluster0.84ay04h.mongodb.net/?appName=Cluster0`;
const url =  "mongodb://admin:admin123@127.0.0.1:27017";
const client = await MongoClient.connect(url);
app.locals.db = client.db("social")