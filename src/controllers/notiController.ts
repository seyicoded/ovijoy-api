import { Request, Response } from "express";
import { WrapperResponse } from "../helper/wrapResponse";
import db from "../../models";

export const getNotification = async (request: Request|any, response: Response)=>{
    try{
        const user = request.user;

        const all = await db.notification.findAll({
            where: {
                userId: user.id
            },
            include: [
                {
                    model: db.users
                }
            ]
        })

        return WrapperResponse("success", {
            message: "Fetched Successfully",
            status: "success",
            payload: all
        }, response)
    }catch(e){
        console.log(e)
        return WrapperResponse("error", {
            message: "Error",
            status: "failed"
        }, response)
    }
}

export const addNotification = async(
    commentId: number,
    actionOwnerId: number,
    action: 'liked' | 'commented'
)=>{
    // get commentOwnerId 
    try {
        const {userId: commentOwnerId} = await db.comments.findOne({
            where: {
                id: commentId
            }
        })

        // create noti entry
        await db.notification.create({
            userId: commentOwnerId,
            actionByUserId: actionOwnerId,
            comment: `${action} your comment`,
            status: 'UNREAD'
        })
    } catch (e) {
        
    }
}