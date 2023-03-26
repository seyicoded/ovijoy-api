import express, {Express, Request, Response, urlencoded} from 'express';
import dB from './models/index'
import router from './src/routes';
import winston from 'winston'
import 'dotenv/config'
import { run } from './src/helper/defaultRunner';

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(urlencoded({
    extended: false
}))
app.use(express.json())

// init database
dB.sequelize.sync({alter: true})

// create default data
run()

// init route
app.use(router)

// app.get('/', (req: Request, res: Response)=>{
//     res.send('Hello, this is Express + TypeScript');
// });

app.listen(port, ()=> {
console.log(`[Server]: I am running at https://localhost:${port}`);
});

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
      //
      // - Write all logs with importance level of `error` or less to `error.log`
      // - Write all logs with importance level of `info` or less to `combined.log`
      //
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format: winston.format.simple(),
    }));
}