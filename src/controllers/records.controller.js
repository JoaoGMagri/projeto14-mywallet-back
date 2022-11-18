import dayjs from "dayjs";

import {
    collectionRecords,
    collectionUsers,
    collectionSessions,
    validateRecords
} from "../index.js";

export async function postTransfers(req, res) {

    const ObjNewTransfer = req.body;
    const { type, value, description } = req.body;
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');

    const { error } = validateRecords.validate(ObjNewTransfer, { abortEarly: false });
    if (error) {
        const erros = error.details.map((detail) => detail.message);
        res.status(409).send(erros);
        return;
    }

    try {
        const userExists = await collectionSessions.findOne({ token: token });

        await collectionRecords.insertOne({
            type,
            value,
            description,
            userId: userExists.userId,
            data: dayjs().format("DD/MM")
        });

        res.send("ok")

    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }

}

export async function getTransfers(req, res) {
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');

    try {
        const userExists = await collectionSessions.findOne({ token: token });
        const user = userExists.userId;
        const userObj = await collectionUsers.findOne({ _id: user });
        const info = await collectionRecords.find({ userId: user }).toArray();

        const obj = {
            user: userObj.name,
            info,
        }

        res.status(200).send(obj);
    } catch (error) {
        res.status(500).send({ message: "Erro com o servidor" });
    }
}