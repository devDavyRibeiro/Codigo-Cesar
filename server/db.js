import mongoose from "mongoose";

mongoose.connect('mongodb://localhost:27017/seguranca');

const User = mongoose.model('User',{
    nome: String,
    email:String,
    senha:String
})

export {User}