import { User } from './db.js';
import bcrypt from 'bcrypt'
export const create = async (req, res) => {
    try {
        const { nome, email, senha } = req.body
    
        const salt = await bcrypt.genSaltSync(saltRounds, async (err, salt) => {
            if (err) {
                throw new Error({message: "Não foi possível gerar salt", err:err, status:500})
            }
            return salt
        })
    
        const hash = await bcrypt.hashSync(senha, salt, async (err, hash) => {
            if (err) {
                res.status(500).json({ message: "Erro ao gerar hash " + err })
                return;
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
        res.status(error.status).json(error)
    }

}

export const login = async (req, res) => {
    const {email, senha } = req.body
    const user = await User.findOne({ email });
    if (!user) {
        res.status(404)
        res.json({ mensage: "Não foi encontrado nenhum usuario com esse email" })
    }

    if(await bcrypt.compareSync(senha, user.senha)){
        res.status(200).json({message: "Usuário encontrado com sucesso!", user})
    }
    else{
        res.status(401).json({message:'Usuário não encontrado'})
    }
}

export const pegarUsuarioId = async (req, res) => {
    const {id} = req.params;
    const user = User.findOne(id)
    if(user){
        res.status(200).json({message:'Usuario encontrado',user})
    }
    else{
        res.status(404).json({message:'Não foi possível encontrar usuário'})
    }
}
export const usuariosAll = async(req,res)=>{
    const users = User.find();
    if(users.length > 0){
        res.status(200).json({message: "usuarios encontrados", users})
    }
    else{
        res.status(404).json({message:'Não foi possível encontrar usuários'})
    }
}


