// import de bibliotecas
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
//Import de arquivos
import { collectionUsers, collectionSessions } from "../database/database.js";

export async function singInMD(req, res, next) {

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

        const objSingIn = { token, userId: userExists._id }

        req.objSingIn = objSingIn;

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }

    next();

}