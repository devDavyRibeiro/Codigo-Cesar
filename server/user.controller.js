import { User, Hash } from './db.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
//import crypto from 'crypto';
dotenv.config();

export const create = async (req, res) => {
    try {
        const { nome, email, senha } = req.body

        if (!nome || !email || !senha) {
            res.status(400).json({ message: 'Nome, email e senha são obrigatórios', err: 'Dados incompletos', status: 400 })
            return;
        }
        const hash = await gerarHash(senha);

        const user = new User({ nome, email, senha: hash })
        const result = await user.save();

        if (user === result) {
            res.status(201).json({ message: 'Usuário criado com sucesso' })
            console.log(user)
        }
        else {
            res.status(500).json({ message: 'Erro ao criar usuário' })
        }

    } catch (error) {
        res.status(500).json({ message: "erro no servidor", err: error, status: 500 })
    }

}

export const login = async (req, res) => {
    try {
        const { email, senha } = req.body
        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({ message: "Não foi encontrado nenhum usuario com esse email", err: "Usuario não encontrado", status: 404 })
        }

        if (!bcrypt.compareSync(senha, user.senha)) {
            res.status(401).json({ message: 'Senha incorreta', err: 'Senha incorreta', status: 401 })
            return;
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ message: 'Login realizado com sucesso!', token });

    } catch (error) {
        res.status(500).json({ message: "erro no servidor", err: error, status: 500 })
    }

}

export const pegarUsuarioId = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (user) {
            res.status(200).json({ message: 'Usuario encontrado', user })
        }
        else {
            res.status(404).json({ message: 'Não foi possível encontrar usuário', err: 'Usuario não encontrado', status: 404 })
        }

    } catch (error) {
        res.status(500).json({ message: "erro no servidor", err: error, status: 500 })
    }
}
export const usuariosAll = async (req, res) => {
    try {
        const users = await User.find();
        if (users.length > 0) {
            res.status(200).json({ message: "usuarios encontrados", users })
        }
        else {
            res.status(404).json({ message: 'Não foi possível encontrar usuários', err: 'Usuários não encontrados', status: 404 })
        }
    } catch (error) {
        res.status(500).json({ message: "erro no servidor", err: error, status: 500 })
    }
}

export const criptografarMensagem = async (req, res) => {
    try {
        const { mensagem, passo } = req.body;

        if (!mensagem || !passo) {
            return res.status(400).json({
                message: 'Mensagem e passo são obrigatórios',
                err: 'Mensagem e passo são obrigatórios',
                status: 400
            });
        }

        const resultado = criptografar(mensagem, passo);

        const hash = await gerarHash(resultado);
        console.log(hash)

        const hashDoc = new Hash({ idUser: req.user.id, passo, hash, usado: false });
        await hashDoc.save();

        res.status(200).json({
            message: 'Mensagem criptografada com sucesso',
            resultado,
            hash
        });

    } catch (error) {
        res.status(500).json({
            message: "Erro no servidor",
            err: error.message,
            status: 500
        });
    }
};

export const descriptografarMensagem = async (req, res) => {
    try {
        const { hash, mensagem } = req.body;
        if (!hash || !mensagem) {
            return res.status(400).json({
                message: 'Hash e mensagem são obrigatórios',
                err: 'Hash e mensagem são obrigatórios',
                status: 400
            });
        }
        const hashDoc = await Hash.findOne({ hash });
        console.log(`Hash recebido para descriptografia: ${hashDoc}`);
        if (!hashDoc) {
            return res.status(404).json({
                message: 'Hash não encontrado',
                err: 'Hash não encontrado',
                status: 404
            });
        }
        console.log(`Tentando decifrar Hash: ${hash} | Status Atual no DB: ${hashDoc.usado}`);

        if (hashDoc.usado) {
            console.error(`BLOQUEADO: O hash ${hash} já consta como usado.`);
            return res.status(400).json({ message: 'Hash já foi usado' });
        }
        const resultado = descriptografar(mensagem, Number(hashDoc.passo));
        hashDoc.usado = true;
        await hashDoc.save();
        res.status(200).json({
            message: 'Mensagem descriptografada com sucesso',
            resultado
        });
    } catch (error) {
        res.status(500).json({
            message: "Erro no servidor",
            err: error.message,
            status: 500,
        });
    }
};

function criptografar(mensagem = "", passo = 10) {
    let letras = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    let resultado = '';
    mensagem = mensagem.toLowerCase();
    for (let i = 0; i < mensagem.length; i++) {
        let char = mensagem[i];
        let index = letras.indexOf(char.toLowerCase());
        if (index !== -1) {
            let newIndex = (index + passo);
            if (newIndex > letras.length) {
                newIndex = newIndex - letras.length;
            }
            resultado += letras[newIndex];
        }
        else {
            resultado += char;
        }

    }
    return resultado;
}

function descriptografar(mensagem = "", passo = 10) {
    let letras = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    let resultado = '';
    mensagem = mensagem.toLowerCase();
    for (let i = 0; i < mensagem.length; i++) {
        let char = mensagem[i];
        let index = letras.indexOf(char.toLowerCase());
        if (index !== -1) {
            let newIndex = (index - passo);
            if (newIndex < 0) {
                newIndex = newIndex + letras.length;
            }
            resultado += letras[newIndex];
        }
        else {
            resultado += char;
        }

    }
    return resultado;
}
async function gerarHash(mensagem) {
    try {
        const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));

        const hash = await bcrypt.hash(mensagem, salt);
        return hash;
    } catch (error) {
        throw new Error("Não foi possível gerar hash: " + error);
    }
}

