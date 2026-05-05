import express from 'express'
import { User } from './db.js';
const router = express.Router();
import { create, login, pegarUsuarioId,usuariosAll} from './user.controller.js';

router.post('/cadastrar', create);
router.post('/login', login);
router.get('/:id', pegarUsuarioId);
router.get('/',usuariosAll)
export default router