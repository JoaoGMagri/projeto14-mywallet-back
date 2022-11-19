// import de bibliotecas
import bcrypt from 'bcrypt';

//Import de arquivos
import { collectionUsers } from "../database/database.js";
import { validateUsers } from "../index.js";

export async function singUpMD(req, res, next) {

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

        const objSingUP ={ ...ObjNewUser, password: hashPassword }

        req.objSingUP = objSingUP;

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }

    next();

}