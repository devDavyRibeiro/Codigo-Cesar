import mongoose from "mongoose";


main().catch(err => console.log("Erro ao conectar ao MongoDB"+err));
async function main() {
  await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/test");
  console.log('MongoDB conectado')
  User = mongoose.model('User',{
        nome: String,
        email:String,
        senha:String
    })
  Hash = mongoose.model('Hash',{
    mensagem: String,
    passo: Number,
    hash: String
  })
}
export {User, Hash}