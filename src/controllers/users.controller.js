// import de bibliotecas
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

//Import de arquivos
import {
    collectionUsers,
    collectionSessions,
    validateUsers,
} from "../index.js";


export async function postSingUp (req, res) {

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

        await collectionUsers.insertOne({...ObjNewUser, password: hashPassword});
        res.sendStatus(201);

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }

}

export async function postSingIn (req, res) {

    const {email, password} = req.body;
    const token = uuidv4();
    console.log(token);

    try {
        
        const userExists = await collectionUsers.findOne({ email });
        if (!userExists) {
            return res.sendStatus(401);
        }

        const passwordOK = bcrypt.compareSync(password, userExists.password);
        if (!passwordOK) {
            return res.sendStatus(401);
        }

        await collectionSessions.insertOne({
            token,
            userId: userExists._id
        });

        res.send({token});

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }

}


//Para testes APAGAR DEPOIS.
export async function getSingUp (req, res) {

    try {
        const nameUsers = await collectionUsers.find().toArray();
    
        res.send(nameUsers)
        
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }

}