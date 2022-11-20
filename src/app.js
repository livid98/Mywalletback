import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import cors from "cors";
import joi from "joi";
import bcrypt from "bcrypt";
import { v4 as uuidV4 } from "uuid";
import dayjs from "dayjs";
import {registrationUser,loginUser} from "./controllers/user.controller.js";
import {EntryMoney,OutMoney, getTransactions} from "./controllers/transaction.controller.js";

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

const mongoClient = new MongoClient(process.env.MONGO_URI);

try {
    await mongoClient.connect();
  } catch (err) {
    console.log(err);
  }

 const db = mongoClient.db("myWallet");

 export const userSchema = joi.object({
    name: joi.string().min(2).required(),
    email: joi.string().email().required(),
    password: joi.string().alphanum().min(6).max(10).required()
})

 export const transactionSchema = joi.object({
    value: joi.number().min(1).positive().required(),
    description: joi.string().required()
})

export const userCollection = db.collection("users");
export const sessionCollection = db.collection("sessions");
export const transactionsCollection = db.collection("transactions");

app.post("/signup", registrationUser);

app.post("/signin", loginUser);

app.post("/transactions", EntryMoney, OutMoney);

app.get("/transactions", getTransactions);

app.listen(5000, () => {
    console.log("Listen on 5000");
  });