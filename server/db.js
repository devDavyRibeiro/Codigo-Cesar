import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

main().catch(err => console.log("Erro ao conectar ao MongoDB"+err));
let User;
let Hash;
async function main() {
  if(!process.env.MONGO_URI){
    console.log('MONGO_URI não encontrado nas variáveis de ambiente');
    return;
  }
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB conectado')
  User = mongoose.model('User',{
        nome: String,
        email:String,
        senha:String
    })
  Hash = mongoose.model('Hash',{
    idUser: String,
    passo: Number,
    hash: String,
    usado: { type: Boolean, default: false }
  })
}
export {User, Hash}