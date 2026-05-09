import { User } from './db.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const create = async (req, res) => {
    try {
        const { nome, email, senha } = req.body
    
        const salt = bcrypt.genSaltSync(process.env.SALT_ROUNDS, async (err, salt) => {
            if (err) {
                res.status(500).json({message: "Não foi possível gerar salt", err:err, status:500})
            }
            return salt
        })
    
        const hash = bcrypt.hashSync(senha, salt, async (err, _) => {
            if (err) {
                res.status(500).json({message: "Não foi possível gerar hash", err:err, status:500})
            }
        });
    
        const user = new User({ nome, email, hash })
        const result = await user.save();
    
        if(user === result){
            res.status(201).json({message: 'Usuário criado com sucesso'})
        }
        else{
            res.status(500).json({message:'Erro ao criar usuário'})
        }
        
    } catch (error) {
        res.status(500).json({message: "erro no servidor", err:error, status:500})
    }

}

export const login = async (req, res) => {
    try {
        const {email, senha } = req.body
        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({ message: "Não foi encontrado nenhum usuario com esse email", err: "Usuario não encontrado", status:404 })
        }
    
        if(!bcrypt.compareSync(senha, user.senha)){
            res.status(401).json({message:'Senha incorreta', err:'Senha incorreta', status:401 })
            return;
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ message: 'Login realizado com sucesso!', token });
        
    } catch (error) {
        res.status(500).json({message: "erro no servidor", err:error, status:500})
    }

}

export const pegarUsuarioId = async (req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findById(id);
        if(user){
            res.status(200).json({message:'Usuario encontrado',user})
        }
        else{
            res.status(404).json({message:'Não foi possível encontrar usuário', err:'Usuario não encontrado', status:404})
        }
        
    } catch (error) {
        res.status(500).json({message: "erro no servidor", err:error, status:500})
    }
}
export const usuariosAll = async(req,res)=>{
    try {
        const users = await User.find();
        if(users.length > 0){
            res.status(200).json({message: "usuarios encontrados", users})
        }
        else{
            res.status(404).json({message:'Não foi possível encontrar usuários', err:'Usuários não encontrados', status:404})
        }
    } catch (error) {
        res.status(500).json({message: "erro no servidor", err:error, status:500})
    }
}

