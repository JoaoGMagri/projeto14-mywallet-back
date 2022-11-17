import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from "mongodb";
import joi from 'joi'
import dotenv from 'dotenv';

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();
const mongoClient = new MongoClient(process.env.MONGO_URI)
await mongoClient.connect();

const db = mongoClient.db("myWallet");
const collectionUsers = db.collection("users");

const validateUsers = joi.object({
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

app.post("/sing-up", async (req, res) => {

    const ObjNewUser = req.body;
    const { email, password, repeat_password, name } = req.body;
    console.log(name);
    console.log(email);
    console.log(password);
    console.log(repeat_password);

    const {error} = validateUsers.validate(ObjNewUser, { abortEarly: false });

    if (error) {
        const erros = error.details.map((detail) => detail.message);
        res.send(erros).status(422);
        return;
    }

    try {
        
        const nameUsers = await collectionUsers.find().toArray();
        const teste = nameUsers.find(obj => obj.name === name)
        
        if (teste) {
            return res.status(409).send("Nome do usuario já existe");
        }
        
        delete ObjNewUser.repeat_password;
        console.log(ObjNewUser)

        await db.collection("users").insertOne(ObjNewUser);

        res.sendStatus(201);
    } catch (error) {
        console.log(error);
    }

});

app.get("/registration", async (req, res) => {

    try {
        const nameUsers = await collectionUsers.find().toArray();
    
        res.send(nameUsers)
        
    } catch (error) {
        console.log(error);
    }

});



app.listen(5000, () => {
    console.log("Server running in port: 5000")
});