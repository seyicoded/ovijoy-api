import cron from 'node-cron'
import db from '../models';
import moment from 'moment';
import { POST_STATUS } from '../src/config/constants/enum/others';
import { Op } from 'sequelize';

const cronAction = (command: string, func: Function)=>{
    cron.schedule(command, func)
}

export const cronActionTrigger = ()=>{
    cronAction('1 1 1-30/2 * *', removeExpiredStatus);
    // cronAction('* * * * * *', removeExpiredGiveaway);
    cronAction('1 1 1-30/2 * *', removeExpiredGiveaway);
}

const removeExpiredStatus = async ()=>{
    // console.log('removeExpiredStatus')
    await removeOld(db.status);
}
const removeExpiredGiveaway = async ()=>{
    // console.log('removeExpireGiveaway')
    await removeOld(db.giveaway);
}

const removeOld = async(model: any)=>{
    // const today = moment().format("YYYY-MM-DD HH:mm:ss");
    let today = (new Date()).toDateString();
    
    const allData =await model.findAll({
        where: {
            status: POST_STATUS.ACTIVE
        }
    });

    for (let i = 0; i < allData.length; i++) {
        const _item = allData[i];
        
        let _postDate = new Date((_item?.updatedAt || "")).toDateString();
        
        if(today != _postDate){
            await model.update({
                status: POST_STATUS.INACTIVE
            },{
                where: {
                    id: _item.id
                }
            })
        }
    }
}