// import de bibliotecas
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

//Import de arquivos
import {
    collectionUsers,
    collectionSessions,
    validateUsers,
} from "../index.js";


export async function postSingUp(req, res) {

    const ObjNewUser = req.body;

    try {

        const userExists = await collectionUsers.find({ email: ObjNewUser.email }).toArray();
        if (userExists.length !== 0) {
            return res.status(409).send({ message: "E-mail já cadastrado" });
        }

        const { error } = validateUsers.validate(ObjNewUser, { abortEarly: false });
        if (error) {
            const erros = error.details.map((detail) => detail.message);
            res.status(409).send(erros);
            return;
        }

        const hashPassword = bcrypt.hashSync(ObjNewUser.password, 10);
        delete ObjNewUser.repeat_password;

        await collectionUsers.insertOne({ ...ObjNewUser, password: hashPassword });
        res.sendStatus(201);

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }

}

export async function postSingIn(req, res) {

    const { email, password } = req.body;
    const token = uuidv4();

    try {

        const userExists = await collectionUsers.findOne({ email });
        if (!userExists) {
            return res.status(401).send({ message: "Email not found" });
        }

        const passwordOK = bcrypt.compareSync(password, userExists.password);
        if (!passwordOK) {
            return res.status(401).send({ message: "Password not found" });
        }

        const userSession = await collectionSessions.findOne({ userId: userExists._id });
        if (userSession) {
            return res.send(userSession.token);
        }

        await collectionSessions.insertOne({
            token,
            userId: userExists._id
        });

        res.send(token);

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }

}

export async function deleteGoOut(req, res) {

    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');
    
    try {
        await collectionSessions.deleteOne({ token: token });
        res.status(200).send({ message: "Documento apagado com sucesso!"});
    } catch (error) {
        console.log(err);
        res.status(500).send({ message: err.message });
    }


}


//Para testes APAGAR DEPOIS.
export async function getSingUp(req, res) {

    try {
        const nameUsers = await collectionUsers.find().toArray();

        res.send(nameUsers)

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }

}