import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from "mongodb";
import joi from 'joi'
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

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

    try {
        
        const userExists = await collectionUsers.find({ email: ObjNewUser.email }).toArray();
        if(userExists.length !== 0) {
            return res.status(409).send({ message: "E-mail já cadastrado"});
        }
        
        const {error} = validateUsers.validate(ObjNewUser, { abortEarly: false });
        if (error) {
            const erros = error.details.map((detail) => detail.message);
            res.status(409).send(erros);
            return;
        }
    
        const hashPassword = bcrypt.hashSync(ObjNewUser.password, 10);
        delete ObjNewUser.repeat_password;

        await db.collection("users").insertOne({...ObjNewUser, password: hashPassword});
        res.sendStatus(201);

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }

});

app.get("/sing-up", async (req, res) => {

    try {
        const nameUsers = await collectionUsers.find().toArray();
    
        res.send(nameUsers)
        
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }

});

app.post( "/sing-in", async (req, res) => {

    const {email, password} = req.body;

    try {
        
        const userExists = await collectionUsers.findOne({ email });
        if (!userExists) {
            return res.sendStatus(401);
        }

        const passwordOK = bcrypt.compareSync(password, userExists.password);
        if (!passwordOK) {
            return res.sendStatus(401);
        }

        res.send({message: `Olá ${userExists.name}, seja bem vindo(a)!`});

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }

});


app.listen(5000, () => {
    console.log("Server running in port: 5000")
});