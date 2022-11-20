import bcrypt from "bcrypt";
import { v4 as uuidV4 } from "uuid";
import dayjs from "dayjs";
import { userSchema, userCollection, sessionCollection } from "../app.js";

export async function registrationUser(req,res){
    const {name, email, password} = req.body;
    const validation = userSchema.validate({name, email, password}, { abortEarly: false });
    if(validation.error){
       const erros = validation.error.details.map((detail) => 
       detail.message);
       res.status(401).send(erros);
       return;
    }
    try{
    const userExist = await userCollection.findOne({email: email});
    if(userExist){
        res.status(409).send("Email já cadastrado");
        return;
    }
    const hashPassword = bcrypt.hashSync(password, 10);

    await userCollection.insertOne({name, email, password: hashPassword });
    res.sendStatus(201);
    }catch(error){
     console.log(error)
     res.sendStatus(500)
    }
};


export async function loginUser(req,res){
    const {email, password} = req.body;
    const token = uuidV4();
    try{
    const userExist = await userCollection.findOne({email});
    if(!userExist){
        res.status(401).send("Email ou senha não cadastrados");
        return;
    }
    const samePassword = bcrypt.compareSync(password, userExist.password);
    if (!samePassword) {
        res.sendStatus(401);
        return;
      }
      const activeSession = await userCollection.findOne({ userId: userExist._id });

    if (activeSession) {
       res.status(401).send({ message: "Você já está logado"});
       return;
    }
    await sessionCollection.insertOne({token,userId: userExist._id});
    res.send({ token });
    res.sendStatus(201);
    }catch(error){
     console.log(error)
     res.sendStatus(500)
    }
}