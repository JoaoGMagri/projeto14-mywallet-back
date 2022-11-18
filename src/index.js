//Import de bibliotecas
import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from "mongodb";
import joi from 'joi'
import dotenv from 'dotenv';

//Import de arquivos
import {
    postSingUp,
    postSingIn,
    deleteGoOut,
} from "./controllers/users.controller.js"

import {
    postTransfers,
    getTransfers,
} from "./controllers/records.controller.js"


const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();
const mongoClient = new MongoClient(process.env.MONGO_URI)
await mongoClient.connect();

const db = mongoClient.db("myWallet");
export const collectionUsers = db.collection("users");
export const collectionSessions = db.collection("sessions");
export const collectionRecords = db.collection("records");

export const validateUsers = joi.object({
    name: joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    password: joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

    repeat_password: joi.ref('password'),
    email: joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
});
export const validateRecords = joi.object({
    type: joi.string()
        .required(),

    value: joi.string()
        .required(),

    description: joi.string()
        .min(3)
        .max(30)
        .required(),
});

app.post("/sing-up", postSingUp);

app.post("/sing-in", postSingIn);

app.delete( "/go-out", deleteGoOut );

app.post( "/transfers", postTransfers );

app.get( "/transfers", getTransfers )


app.listen(5000, () => {
    console.log("Server running in port: 5000")
});