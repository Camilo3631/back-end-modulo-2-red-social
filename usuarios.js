import { Router } from "express";

const router = Router();

import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";


const app = express()

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


const url= `mongodb+srv://karlaperezn96_db_user:EnUnLugar...@cluster0.84ay04h.mongodb.net/?appName=Cluster0`;
const client = await MongoClient.connect(url);
app.locals.db = client.db("social")

//router.post("/register"), async (req, res) => {
  //const { name, surname, email, username, password } = req.body;}
  //let client;














export default router;