import { Request, Response } from "express";
import Joi from "joi";
import db from "../../models";
// import { CATEGORY_STATUS } from "../config/constants/enum/category";
import { WrapperResponse } from "../helper/wrapResponse";
import fs from 'fs'
import path from 'path'
import { LIKE_STATUS, POST_STATUS, STATUS_STATUS } from "../config/constants/enum/others";
import { addNotification } from "./notiController";

export const toggleCommentController = async (request: Request|any, response: Response)=>{

    try{
        const user = request.user;

        const {error, value} = Joi.object({
            type: Joi.any().required().label("Type"),
            id: Joi.any().required().label("Id"),
        }).validate(request.params)
    
        if(error){
            return WrapperResponse("error", {
                message: error.message,
                status: "failed"
            }, response)
        }

        const {error: error1, value: value1} = Joi.object({
            comment: Joi.any().required().label("Comment"),
        }).validate(request.body)
    
        if(error1){
            return WrapperResponse("error", {
                message: error1.message,
                status: "failed"
            }, response)
        }

        if(value.type == 'status'){
            await db.comments.create({
                userId: user.id,
                statusId: value.id,
                comment: value1.comment,
                active: LIKE_STATUS.ACTIVE
            })
        }else if(value.type == 'post'){
            await db.comments.create({
                userId: user.id,
                postId: value.id,
                comment: value1.comment,
                active: LIKE_STATUS.ACTIVE
            })
        }else if(value.type == 'comment'){
            await db.comments.create({
                userId: user.id,
                commentId: value.id,
                comment: value1.comment,
                active: LIKE_STATUS.ACTIVE
            }) 
            // it's only here we would add the noti
            await addNotification(value.id, user.id, 'commented')
        }

        return WrapperResponse("success", {
            message: "Action Completed Successfully",
            status: "success",
        }, response)
    }catch(e){
        console.log(e)
        return WrapperResponse("error", {
            message: "Error",
            status: "failed"
        }, response)   
    }

}