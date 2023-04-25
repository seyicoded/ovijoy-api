import { Request, Response } from "express"
import { WrapperResponse } from "../helper/wrapResponse"
import Joi from "joi";
import db from "../../models";
import { POST_STATUS } from "../config/constants/enum/others";
import { Op } from "sequelize";

export const createCollection = async (request: Request|any, response: Response)=>{
    try{
        const user = request.user;

        const {error, value} = Joi.object({
            title: Joi.any().required().label("Title"),
        }).validate(request.body)
    
        if(error){
            return WrapperResponse("error", {
                message: error.message,
                status: "failed"
            }, response)
        }

        await db.collection.create({
            title: value.title,
            status: POST_STATUS.ACTIVE,
            userId: user.id
        })

        return WrapperResponse("success", {
            message: "Created Successfully",
            status: "success"
        }, response)
    }catch(e){
        console.log(e)
        return WrapperResponse("error", {
            message: "Error",
            status: "failed"
        }, response)   
    }
}

export const addPostToBookmark = async (request: Request|any, response: Response)=>{
    try{
        const user = request.user;

        const {error, value} = Joi.object({
            postId: Joi.any().required().label("postId"),
        }).validate(request.body)
    
        if(error){
            return WrapperResponse("error", {
                message: error.message,
                status: "failed"
            }, response)
        }

        let action = "Created";

        // check if bookmark exist
        const exist = await db.bookmark.findOne({
            postId: value.postId,
            userId: user.id,
        })
        if(!exist){
            await db.bookmark.create({
            postId: value.postId,
            userId: user.id,
            collectionId: 1,
            status: POST_STATUS.ACTIVE
        })
        }else{
            action = "Removed";
            await db.bookmark.destroy({
                where: {
                    postId: value.postId,
                    userId: user.id,
                }
            })
        }

        return WrapperResponse("success", {
            message: action+" Successfully",
            status: "success"
        }, response)
    }catch(e){
        console.log(e)
        return WrapperResponse("error", {
            message: "Error",
            status: "failed"
        }, response)   
    }
}

export const moveBookmarkToCollection = async (request: Request|any, response: Response)=>{
    try{
        const user = request.user;

        const {error, value} = Joi.object({
            bookmarkId: Joi.any().required().label("bookmarkId"),
            collectionId: Joi.any().required().label("collectionId"),
        }).validate(request.body)
    
        if(error){
            return WrapperResponse("error", {
                message: error.message,
                status: "failed"
            }, response)
        }

        await db.bookmark.update({
            collectionId: value.collectionId
        }, {
            where: {
                id: value.bookmarkId
            }
        })

        return WrapperResponse("success", {
            message: "Moved Successfully",
            status: "success"
        }, response)
    }catch(e){
        console.log(e)
        return WrapperResponse("error", {
            message: "Error",
            status: "failed"
        }, response)   
    }
}

export const fetchCollections = async (request: Request|any, response: Response)=>{
    try{
        const user = request.user;

        const all = await db.collection.findAll({
            where: {
                userId: {
                    [Op.or]: [1, user.id]
                },
                // [Op.or]: [
                //     {userId: 1},
                //     {userId: user.id}
                // ]
            },
            include: [
                {
                    model: db.bookmark,
                    where: {
                        userId: user.id
                    },
                    include: [
                        {
                            model: db.post,
                            include: [
                                {
                                    model: db.users,
                                },
                                {
                                    model: db.category,
                                },
                                {
                                    model: db.likes,
                                },
                                {
                                    model: db.comments,
                                    include: [
                                        {
                                            model: db.likes
                                        },
                                        {
                                            model: db.users
                                        },
                                        {
                                            model: db.comments,
                                            as: 'commentHost',
                                            include: [
                                                {
                                                    model: db.users
                                                },
                                                {
                                                    model: db.likes
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        })

        return WrapperResponse("success", {
            message: "Fetch Successfully",
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