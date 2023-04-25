import { Request, Response } from "express";
import Joi from "joi";
import db from "../../models";
// import { CATEGORY_STATUS } from "../config/constants/enum/category";
import { WrapperResponse } from "../helper/wrapResponse";
import fs from 'fs'
import path from 'path'
import { POST_STATUS, STATUS_STATUS } from "../config/constants/enum/others";
import { updateStatusViewCountController } from "./viewController";
// import formidable from 'formidable'
const formidable = require('formidable');


export const createStatusController = async (request: Request | any, response: Response) => {
    try {

        const data = request.body;

        const _path = __dirname + '/../../uploads/status';
        const form = formidable({
            multiples: true,
            uploadDir: _path,
            keepExtensions: true
        });

        form.parse(request, async (err, fields, files) => {
            if (err) {
                console.log(err)
                return WrapperResponse("error", {
                    message: "Error",
                    status: "failed"
                }, response)
                return;
            }

            const { newFilename, mimetype: fileType } = files.media;

            const { error, value } = Joi.object({
                caption: Joi.string().required().label("caption"),
                category_id: Joi.string().required().label("category id"),
                hashtags: Joi.string().required().label("hashtags"),
                country: Joi.string().required().label("country"),
            }).validate(fields)

            if (error) {
                console.log(error)
                return WrapperResponse("error", {
                    message: error.message,
                    status: "failed"
                }, response)
            }


            // create file
            const __user = (request.user);
            const __status = await db.status.create({
                caption: value.caption,
                media: `uploads/status/${newFilename}`,
                mediaType: fileType,
                hashtags: value.hashtags,
                country: value.country,
                status: POST_STATUS.ACTIVE,
                userId: __user.id,
                categoryId: value.category_id
            })

            return WrapperResponse("success", {
                message: "Created Successfully",
                status: "success",
            }, response)

        });

    } catch (e) {
        console.log(e)
        return WrapperResponse("error", {
            message: "Error",
            status: "failed"
        }, response)
    }
}

export const editStatusController = async (request: Request | any, response: Response) => {
    try {
        const _path = __dirname + '/../../uploads/status';
        const form = formidable({
            multiples: true,
            uploadDir: _path,
            keepExtensions: true
        });

        form.parse(request, async (err, fields, files) => {
            if (err) {
                return WrapperResponse("error", {
                    message: "Error",
                    status: "failed"
                }, response)
                return;
            }

            const { newFilename, mimetype: fileType } = files?.media || {};

            const { error, value } = Joi.object({
                caption: Joi.string().required().label("caption"),
                hashtags: Joi.string().required().label("hashtags"),
                country: Joi.string().required().label("country"),
                hasMedia: Joi.string().required().label("has Media"),
                post_id: Joi.any().required().label("post id"),
                category_id: Joi.string().required().label("category id"),
            }).validate(fields)

            if (error) {
                return WrapperResponse("error", {
                    message: error.message,
                    status: "failed"
                }, response)
            }

            const __user = (request.user);
            if ((value?.hasMedia || 'no').toLowerCase() === 'yes') {

                const __status = await db.status.update({
                    caption: value.caption,
                    media: `uploads/status/${newFilename}`,
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
            } else {
                const __status = await db.status.update({
                    caption: value.caption,
                    hashtags: value.hashtags,
                    country: value.country,
                    status: POST_STATUS.ACTIVE,
                    userId: __user.id,
                    categoryId: value.category_id
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

    } catch (e) {
        return WrapperResponse("error", {
            message: "Error",
            status: "failed"
        }, response)
    }
}

export const deleteStatusController = async (request: Request | any, response: Response) => {
    try {
        // validate 
        const { error, value } = Joi.object({
            id: Joi.number().required().label("post id")
        }).validate(request.params)

        if (error) {
            return WrapperResponse("error", {
                message: error.message,
                status: "failed"
            }, response)
        }

        await db.status.destroy({
            where: {
                id: value.id
            }
        });

        return WrapperResponse("success", {
            message: "Deleted Successfully",
            status: "success"
        }, response)
    } catch (e) {
        return WrapperResponse("error", {
            message: "Error",
            status: "failed"
        }, response)
    }
}

export const getStatusController = async (request: Request | any, response: Response) => {
    try {
        setTimeout(()=>{
            try{
                (async()=>{
                    await updateStatusViewCountController()
                })()
            }catch(e){}
        }, 10)
        const user = request.user;
        const allPostStatus = await db.status.findAll({
            where: {
                status: STATUS_STATUS.ACTIVE,
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
        })

        const filteredStatus = [];

        for (let i = 0; i < allPostStatus.length; i++) {
            const _status = allPostStatus[i].get();

            const userHasLiked = (await db.likes.findOne({
                where: {
                    userId: user.id,
                    statusId: _status.id
                }
            })) ? true : false;

            const userHasCommented = (await db.comments.findOne({
                where: {
                    userId: user.id,
                    statusId: _status.id
                }
            })) ? true : false;

            filteredStatus.push({
                ..._status,
                userHasLiked,
                userHasCommented
            })
        }

        return WrapperResponse("success", {
            message: "Fetched Successfully",
            status: "success",
            payload: filteredStatus
        }, response)
    } catch (e) {
        console.log(e)
        return WrapperResponse("error", {
            message: "Error",
            status: "failed"
        }, response)
    }
}