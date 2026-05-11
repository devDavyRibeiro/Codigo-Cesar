import express from 'express'
import { User } from './db.js';
import { create, login, pegarUsuarioId,usuariosAll,criptografarMensagem,descriptografarMensagem} from './user.controller.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

const router = express.Router();
dotenv.config();
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Token inválido' });
    }
}

router.post('/cadastrar', create);
router.post('/login', login);

router.post('/criptografar', criptografarMensagem);
router.post('/descriptografar', descriptografarMensagem);
router.use(authenticateToken);

router.get('/',usuariosAll)
router.get('/:id', pegarUsuarioId);



export default router