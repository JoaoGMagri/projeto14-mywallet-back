import { collectionRecords, collectionUsers, collectionSessions } from "../database/database.js";

export async function getTransfersMD(req, res, next) {

    const userExists = req.userExists;

    try {

        const user = userExists.userId; 
        const userObj = await collectionUsers.findOne({ _id: user });
        const info = await collectionRecords.find({ userId: user }).toArray();

        const objResp = {
            user: userObj.name,
            info,
        }
        req.objResp = objResp;

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }

    next();

}