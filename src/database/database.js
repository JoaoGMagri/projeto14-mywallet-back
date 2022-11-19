import { MongoClient, ObjectId } from "mongodb";
import dotenv from 'dotenv';

dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI)
await mongoClient.connect();

const db = mongoClient.db("myWallet");
export const collectionUsers = db.collection("users");
export const collectionSessions = db.collection("sessions");
export const collectionRecords = db.collection("records");