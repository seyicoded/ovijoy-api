import { Request, Response, NextFunction} from 'express'
import { WrapperResponse } from '../helper/wrapResponse';
import "dotenv/config"

var jwt = require('jsonwebtoken');

export const authMiddleWare = (req: Request|any, res: Response, next: NextFunction)=>{
    if (!req.headers.authorization) {
        return WrapperResponse("error", {
            message: "Authorization Token is Required",
            status: "failed"
        }, res)
    }

    const token = (req.headers.authorization).split(' ')[1];
    // validate jwt
    try{
        var decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.data;
    }catch(e){
        return WrapperResponse("error", {
            message: "Authorization Token is Invalid",
            status: "failed"
        }, res)
    }

    next();
}