// import de bibliotecas
import dayjs from "dayjs";
//Import de arquivos
import { validateRecords } from "../index.js";

export async function postTransfersMD(req, res, next) {

    const ObjNewTransfer = req.body;
    const { type, value, description } = req.body;
    const userExists = req.userExists;

    try {

        const { error } = validateRecords.validate(ObjNewTransfer, { abortEarly: false });
        if (error) {
            const erros = error.details.map((detail) => detail.message);
            res.status(409).send(erros);
            return;
        }

        const objPost = {
            type,
            value,
            description,
            userId: userExists.userId,
            data: dayjs().format("DD/MM")
        }
        
        req.objPost = objPost;

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }

    next();

}