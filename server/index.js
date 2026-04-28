import express from 'express';
import cors from 'cors'
import bodyParser from 'body-parser';
const app = express();

app.use(cors({
  origin: '*', // Apenas este domínio pode acessar
  optionsSuccessStatus: 200
}))
app.use(bodyParser.json())

app.listen(3000,()=>{
    console.log('Server iniciado')
})