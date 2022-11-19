//Import de arquivos
import { collectionRecords } from "../database/database.js";

export async function postTransfers(req, res) {

    const objPost = req.objPost

    try {
        await collectionRecords.insertOne(objPost);
        res.send("ok")
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }

}

export async function getTransfers(req, res) {
    
    const objResp = req.objResp;
    try {
        res.status(200).send(objResp);
    } catch (error) {
        res.status(500).send({ message: "Erro com o servidor" });
    }
}