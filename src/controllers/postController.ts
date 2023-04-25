import { Request, Response } from "express";
import Joi from "joi";
import db from "../../models";
import { CATEGORY_STATUS } from "../config/constants/enum/category";
import { WrapperResponse } from "../helper/wrapResponse";
import fs from 'fs'
import path from 'path'
import { POST_STATUS } from "../config/constants/enum/others";
import {Op} from 'sequelize'
import { updatePostViewCountController } from "./viewController";
// import formidable from 'formidable'
const formidable = require('formidable');


export const createPostController = async (request: Request|any, response: Response)=>{
    try{

        const data = request.body;

        const _path = __dirname + '/../../uploads/posts';
        const form = formidable({ 
            multiples: true,
            uploadDir: _path,
            keepExtensions: true,
            // filename: (name, ext, path, form)=>{

            //     console.warn(`${name}.${ext}`)
            //     return `${name}.${ext}`;
            // }
         });

        // form.on("file", (name, file)=>{
        //     console.warn(name, file)
        // })
        
        form.parse(request, async (err, fields, files) => {
            if (err) {
                return WrapperResponse("error", {
                    message: "Error",
                    status: "failed"
                }, response)
              return;
            }

            const {newFilename, mimetype: fileType} = files.media;

            const {error, value} = Joi.object({
                caption: Joi.string().required().label("caption"),
                hashtags: Joi.string().required().label("hashtags"),
                country: Joi.string().required().label("country"),
            }).validate(fields)
    
            if(error){
                return WrapperResponse("error", {
                    message: error.message,
                    status: "failed"
                }, response)
            }


            // create file
            const __user = (request.user);
            const __post = await db.post.create({
                caption: value.caption,
                media: `uploads/posts/${newFilename}`,
                mediaType: fileType,
                hashtags: value.hashtags,
                country: value.country,
                status: POST_STATUS.ACTIVE,
                userId: __user.id
            })

            return WrapperResponse("success", {
                message: "Created Successfully",
                status: "success",
            }, response)
            
        });
        
    }catch(e){
        return WrapperResponse("error", {
            message: "Error",
            status: "failed"
        }, response)
    }
}

export const editPostController = async (request: Request|any, response: Response)=>{
    try{
        const _path = __dirname + '/../../uploads/posts';
        const form = formidable({ 
            multiples: true,
            uploadDir: _path,
            keepExtensions: true,
            // filename: (name, ext, path, form)=>{

            //     console.warn(`${name}.${ext}`)
            //     return `${name}.${ext}`;
            // }
        });

        form.parse(request, async (err, fields, files) => {
            if (err) {
                return WrapperResponse("error", {
                    message: "Error",
                    status: "failed"
                }, response)
              return;
            }

            const {newFilename, mimetype: fileType} = files?.media || {};

            const {error, value} = Joi.object({
                caption: Joi.string().required().label("caption"),
                hashtags: Joi.string().required().label("hashtags"),
                country: Joi.string().required().label("country"),
                hasMedia: Joi.string().required().label("has Media"),
                post_id: Joi.any().required().label("post id")
            }).validate(fields)
    
            if(error){
                return WrapperResponse("error", {
                    message: error.message,
                    status: "failed"
                }, response)
            }

            const __user = (request.user);
            if((value?.hasMedia || 'no').toLowerCase() === 'yes'){
                
                const __post = await db.post.update({
                    caption: value.caption,
                    media: `uploads/posts/${newFilename}`,
                    mediaType: fileType,
                    hashtags: value.hashtags,
                    country: value.country,
                    status: POST_STATUS.ACTIVE,
                    userId: __user.id
                }, {
                    where: {
                        id: value.post_id
                    }
                })
            }else{
                const __post = await db.post.update({
                    caption: value.caption,
                    hashtags: value.hashtags,
                    country: value.country,
                    status: POST_STATUS.ACTIVE,
                    userId: __user.id
                }, {
                    where: {
                        id: value.post_id
                    }
                })
            }


            return WrapperResponse("success", {
                message: "Edited Successfully",
                status: "success",
            }, response)
            
        });

    }catch(e){
        return WrapperResponse("error", {
            message: "Error",
            status: "failed"
        }, response)
    }
}

export const deletePostController = async (request: Request|any, response: Response)=>{
    try{
        // validate 
        const {error, value} = Joi.object({
            id: Joi.number().required().label("post id")
        }).validate(request.params)

        if(error){
            return WrapperResponse("error", {
                message: error.message,
                status: "failed"
            }, response)
        }
        
        await db.post.destroy({
            where: {
                id: value.id
            }
        });
    
        return WrapperResponse("success", {
            message: "Deleted Successfully",
            status: "success"
        }, response)
    }catch(e){
        return WrapperResponse("error", {
            message: "Error",
            status: "failed"
        }, response)
    }
}

export const getPostController = async (request: Request|any, response: Response)=>{
    try{
        setTimeout(()=>{
            try{
                (async()=>{
                    await updatePostViewCountController()
                })()
            }catch(e){}
        }, 10)
        const user = request.user;
        const allPost = await db.post.findAll({
            where: {
                status: POST_STATUS.ACTIVE,
            },
            // include: { all: true, nested: true }
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
                            as: 'commentHost'
                        }
                    ]
                }
            ]
        })

        const filteredPost = [];
        
        for (let i = 0; i < allPost.length; i++) {
            const _post = allPost[i].get();
            
            const userHasLiked = (await db.likes.findOne({
                where: {
                    userId: user.id,
                    postId: _post.id
                }
            })) ? true : false;

            const userHasCommented = (await db.comments.findOne({
                where: {
                    userId: user.id,
                    postId: _post.id
                }
            })) ? true : false;

            filteredPost.push({
                ..._post,
                userHasLiked,
                userHasCommented
            })
        }

        return WrapperResponse("success", {
            message: "Fetched Successfully",
            status: "success",
            payload: filteredPost
        }, response)
    }catch(e){
        console.log(e)
        return WrapperResponse("error", {
            message: "Error",
            status: "failed"
        }, response)
    }
}