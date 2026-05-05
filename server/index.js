import express from 'express';
import cors from 'cors'
import bodyParser from 'body-parser';
import router from './routes.js';
const app = express();

app.use(cors({
  origin: '*', // Apenas este domínio pode acessar
  optionsSuccessStatus: 200
}))
app.use(bodyParser.json())
app.use('/user/', router)

app.listen(3000,()=>{
    console.log('Server iniciado')
})