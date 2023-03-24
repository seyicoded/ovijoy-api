import express, {Express, Request, Response, urlencoded} from 'express';
import dB from './models/index'
import 'dotenv/config'
import router from './src/routes';

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(urlencoded({
    extended: false
}))
app.use(express.json())

// init database
dB.sequelize.sync({alter: true})

// init route
app.use(router)

// app.get('/', (req: Request, res: Response)=>{
//     res.send('Hello, this is Express + TypeScript');
// });

app.listen(port, ()=> {
console.log(`[Server]: I am running at https://localhost:${port}`);
});