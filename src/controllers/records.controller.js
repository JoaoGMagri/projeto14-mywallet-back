import dayjs from "dayjs";

import {
    collectionRecords,
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