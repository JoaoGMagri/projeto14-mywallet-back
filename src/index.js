//Import de bibliotecas
import express from 'express';
import cors from 'cors';
import joi from 'joi'

import usersRouters from "./routers/users.routers.js"
import recordsRoutes from "./routers/records.routers.js"

const app = express();
app.use(cors());
app.use(express.json());
app.use(usersRouters);
app.use(recordsRoutes);

export const validateUsers = joi.object({
    name: joi.string().min(3).max(30).required(),
    password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    repeat_password: joi.ref('password'),
    email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
});
export const validateRecords = joi.object({
    type: joi.string().required(),
    value: joi.string().required(),
    description: joi.string().min(3).max(30).required(),
});

app.listen(5000, () => {
    console.log("Server running in port: 5000")
});