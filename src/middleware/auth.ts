import { Request, Response, NextFunction} from 'express'
import { WrapperResponse } from '../helper/wrapResponse';
import "dotenv/config"
import { USER_ROLE } from '../config/constants/enum/auth';

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

export const authAdminMiddleWare = (req: Request|any, res: Response, next: NextFunction)=>{
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

        if(decoded.data.role !== USER_ROLE.ADMIN){
            return WrapperResponse("error", {
                message: "Authorization Token is Invalid as Admin",
                status: "failed"
            }, res)
        }
    }catch(e){
        return WrapperResponse("error", {
            message: "Authorization Token is Invalid",
            status: "failed"
        }, res)
    }

    next();
}