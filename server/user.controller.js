import {} from 'mongoose'
import { User } from './db'
const create = async (req,res)=>{
   const user = new User(req.body);
   await user.save()
}

const login = async(req,res)=>{
    const user = await User.findOne({email: req.body.email});
    if(!user){
        res.status(404)
        res.json({mensage: "Não foi encontrado nenhum usuario com esse email"})
        return
    }
    
}