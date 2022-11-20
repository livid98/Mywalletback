import dayjs from "dayjs";
import { transactionSchema, userCollection, sessionCollection, transactionsCollection} from "../app.js";


export async function EntryMoney(req,res){
    const {value, description} = req.body;
    const {authorization} = req.headers; 
    const date = dayjs(new Date()).format('DD/MM');
    const token = authorization?.replace("Bearer ", "");

    const validation = transactionSchema.validate({value, description}, { abortEarly: false });
    if(validation.error){
       const erros = validation.error.details.map((detail) => 
       detail.message);
       res.status(401).send(erros);
       return;
    }
    if(!token){
        res.sendStatus(401);
        return
     }
    try{
     const activeSession = await sessionCollection.findOne({token});
     const user = await userCollection.findOne({_id: activeSession.userId});
     if(!user){
        res.sendStatus(401);
        return
     }
     await transactionsCollection.insertOne({UserId: user._id, date:date, value: value, description, type: "entryMoney" });
     res.sendStatus(201);;
    }catch(error){
        console.log(error)
        res.sendStatus(500)
       }
}


export async function OutMoney(req,res){
    const {value, description} = req.body;
    const {authorization} = req.headers; 
    const date = dayjs(new Date()).format('DD/MM');
    const token = authorization?.replace("Bearer ", "");

    const validation = transactionSchema.validate({value, description}, { abortEarly: false });
    if(validation.error){
       const erros = validation.error.details.map((detail) => 
       detail.message);
       res.status(401).send(erros);
       return;
    }
    if(!token){
        res.sendStatus(401);
        return
     }
    try{
     const activeSession = await sessionCollection.findOne({token});
     const user = await userCollection.findOne({_id: activeSession.userId});
     if(!user){
        res.sendStatus(401);
        return
     }
     await transactionsCollection.insertOne({UserId: user._id, date:date, value: value, description, type: "outMoney" });
     res.sendStatus(201);;
    }catch(error){
        console.log(error)
        res.sendStatus(500)
       }
}

export async function getTransactions(req,res){
    const {authorization} = req.headers; 
    const token = authorization?.replace("Bearer ", "");
    if(!token){
        res.sendStatus(401);
        return
     }
    try{
    const  transactions = await transactionsCollection.find().toArray()
    res.send(transactions)
    }catch(error){
        console.log(error)
        res.sendStatus(500)
       }
}