import db from "../../models"
import { POST_STATUS } from "../config/constants/enum/others"

export const updatePostViewCountController = async ()=>{
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
