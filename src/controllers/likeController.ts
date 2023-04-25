import { Request, Response } from "express";
import Joi from "joi";
import db from "../../models";
// import { CATEGORY_STATUS } from "../config/constants/enum/category";
import { WrapperResponse } from "../helper/wrapResponse";
import fs from 'fs'
import path from 'path'
import { LIKE_STATUS, POST_STATUS, STATUS_STATUS } from "../config/constants/enum/others";
import { addNotification } from "./notiController";

export const toggleLikeController = async (request: Request|any, response: Response)=>{

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

        if(value.type == 'status'){
            const raw = await db.likes.findOne({
                where: {
                    userId: user.id,
                    statusId: value.id
                }
            });
            const userHasLiked = (raw) ? true : false;

            if(!userHasLiked){
                // create
                await db.likes.create({
                    userId: user.id,
                    statusId: value.id,
                    active: LIKE_STATUS.ACTIVE
                })
            }else{
                // destroy
                await db.likes.destroy({
                    where: {
                        id: raw.id
                    }
                })
            }

        }else if(value.type == 'post'){
            const raw = await db.likes.findOne({
                where: {
                    userId: user.id,
                    postId: value.id
                }
            });
            const userHasLiked = (raw) ? true : false;

            if(!userHasLiked){
                // create
                await db.likes.create({
                    userId: user.id,
                    postId: value.id,
                    active: LIKE_STATUS.ACTIVE
                })
            }else{
                // destroy
                await db.likes.destroy({
                    where: {
                        id: raw.id
                    }
                })
            }

        }else if(value.type == 'comment'){
            const raw = await db.likes.findOne({
                where: {
                    userId: user.id,
                    commentId: value.id
                }
            });
            const userHasLiked = (raw) ? true : false;

            if(!userHasLiked){
                // create
                await db.likes.create({
                    userId: user.id,
                    commentId: value.id,
                    active: LIKE_STATUS.ACTIVE
                })

                // it's only here we would add the noti
            await addNotification(value.id, user.id, 'liked')
            }else{
                // destroy
                await db.likes.destroy({
                    where: {
                        id: raw.id
                    }
                })
            }

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