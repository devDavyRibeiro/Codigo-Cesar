import mongoose from "mongoose";


main().catch(err => console.log("Erro ao conectar ao MongoDB"+err));
let User
async function main() {
  await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/test");
  console.log('MongoDB conectado')
    User = mongoose.model('User',{
        nome: String,
        email:String,
        senha:String
    })
}
export {User}