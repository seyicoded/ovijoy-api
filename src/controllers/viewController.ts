import Joi from "joi"
import db from "../../models"
import { POST_STATUS } from "../config/constants/enum/others"
import { WrapperResponse } from "../helper/wrapResponse"
import { Response, Request } from "express"

export const updatePostViewCountController = async ()=>{
    return
    const all = await db.post.findAll({
        where: {
            status: POST_STATUS.ACTIVE
        }
    })

    for (let i = 0; i < all.length; i++) {
        const _item = all[i];
        
        let __item = _item.get();

        await db.post.update({
            views: __item.views + 1
        }, {
            where: {
                id: __item.id
            }
        })
    }
}

export const updateStatusViewCountController = async ()=>{
    return
    const all = await db.status.findAll({
        where: {
            status: POST_STATUS.ACTIVE
        }
    })

    for (let i = 0; i < all.length; i++) {
        const _item = all[i];
        
        let __item = _item.get();

        await db.status.update({
            views: __item.views + 1
        }, {
            where: {
                id: __item.id
            }
        })
    }
}

export const updateGiveawayViewCountController = async ()=>{
    return
    const all = await db.giveaway.findAll({
        where: {
            status: POST_STATUS.ACTIVE
        }
    })

    for (let i = 0; i < all.length; i++) {
        const _item = all[i];
        
        let __item = _item.get();

        await db.giveaway.update({
            views: __item.views + 1
        }, {
            where: {
                id: __item.id
            }
        })
    }
}

export const updateViewController = async (request: Request|any, response: Response)=>{

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
            const raw = await db.viewrecord.findOne({
                where: {
                    userId: user.id,
                    statusId: value.id
                }
            });
            const userHasLiked = (raw) ? true : false;

            if(!userHasLiked){

                // get status and update
                const _status = await db.status.findOne({
                    where: {
                        id: value.id
                    }
                })

                await db.status.update({
                    views: _status.views + 1
                }, {
                    where: {
                        id: value.id
                    }
                })

                // create
                await db.viewrecord.create({
                    userId: user.id,
                    statusId: value.id
                })
            }else{
                // destroy
                return WrapperResponse("success", {
                    message: "Already Viewed",
                    status: "success",
                }, response)
            }

        }else if(value.type == 'post'){
            const raw = await db.viewrecord.findOne({
                where: {
                    userId: user.id,
                    postId: value.id
                }
            });
            const userHasLiked = (raw) ? true : false;

            if(!userHasLiked){

                // get post and update
                const _post = await db.post.findOne({
                    where: {
                        id: value.id
                    }
                })

                await db.post.update({
                    views: _post.views + 1
                }, {
                    where: {
                        id: value.id
                    }
                })

                // create
                await db.viewrecord.create({
                    userId: user.id,
                    postId: value.id
                })
            }else{
                // destroy
                return WrapperResponse("success", {
                    message: "Already Viewed",
                    status: "success",
                }, response)
            }

        }else if(value.type == 'giveaway'){
            const raw = await db.viewrecord.findOne({
                where: {
                    userId: user.id,
                    giveawayId: value.id
                }
            });
            const userHasLiked = (raw) ? true : false;

            if(!userHasLiked){

                // get giveaway and update
                const _giveaway = await db.giveaway.findOne({
                    where: {
                        id: value.id
                    }
                })

                await db.giveaway.update({
                    views: _giveaway.views + 1
                }, {
                    where: {
                        id: value.id
                    }
                })

                // create
                await db.viewrecord.create({
                    userId: user.id,
                    giveawayId: value.id
                })

            }else{
                // destroy
                return WrapperResponse("success", {
                    message: "Already Viewed",
                    status: "success",
                }, response)
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