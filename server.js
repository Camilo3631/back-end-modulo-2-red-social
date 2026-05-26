import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";

//Importar archivos endpoints

const app = express()

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Rutas de archivos

app.listen(process.env.PORT || 3000);

const url= `mongodb+srv://karlaperezn96_db_user:EnUnLugar...@cluster0.84ay04h.mongodb.net/?appName=Cluster0`;
const client = await MongoClient.connect(url);
app.locals.db = client.db("social")