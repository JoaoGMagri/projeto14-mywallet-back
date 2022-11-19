import { collectionSessions } from "../database/database.js";

export async function authorization(req, res, next) {

    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');

    try {
        const userExists = await collectionSessions.findOne({ token: token });
        req.userExists = userExists;
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }

    next();

}