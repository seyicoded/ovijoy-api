import { Request, Response } from "express";
import { WrapperResponse } from "../helper/wrapResponse";
import moment from "moment";
import db from "../../models";
import { Op } from "sequelize";
import { USER_ROLE, USER_STATUS } from "../config/constants/enum/auth";

export const fetchAnalyticsController = async (request: Request|any, response: Response)=>{
    try {
        const { date = 'now', dateEnded = '' } = request.query;
        // console.log((new Date()).toISOString())
        // console.log((new Date(date)).toDateString(), "before")
        const __date = moment((new Date(date)).toISOString()).format("MMMM DD YYYY");
        const __dateRaw = moment((new Date(date)).toISOString());
        const __dateRawOb = {
            day: __dateRaw.format('DD'),
            month: __dateRaw.format('MM'),
            year: __dateRaw.format('YYYY')
        };
        
        const __dateRawEnd = moment((new Date(dateEnded || '')).toISOString());
        const __dateRawEndedOb = {
            day: __dateRawEnd.format('DD'),
            month: __dateRawEnd.format('MM'),
            year: __dateRawEnd.format('YYYY')
        };
        // console.log(__date+'%', "after")
        
        const dataToReturn = {
            users: [],
            likes: [],
            comments: [],
            shares: [],
        }

        const allData = {
            users: [],
            likes: [],
            comments: [],
            shares: [],
        }

        
        // fetch :users: record per month
        const __users = await db.users.findAll({
            where: {
                role: USER_ROLE.USER,
                status: USER_STATUS.ACTIVE
            }
        })

        let ___users = [];
        for (let i = 0; i < __users.length; i++) {
            const item = __users[i];
            let tmpDate = moment(item.createdAt);
            const __tmpDateOb = {
                day: tmpDate.format('DD'),
                month: tmpDate.format('MM'),
                year: tmpDate.format('YYYY')
            };
            // console.log(__tmpDateOb, ' :log1')

            console.log((parseInt(__tmpDateOb.year) <= parseInt(__dateRawEndedOb.year) ), __dateRawEndedOb.year, __tmpDateOb.year)
            console.log(( parseInt(__tmpDateOb.year) >= parseInt(__dateRawOb.year)))
            if( ( parseInt(__tmpDateOb.year) >= parseInt(__dateRawOb.year) && parseInt(__tmpDateOb.year) <= parseInt(__dateRawEndedOb.year) ) &&
            ( parseInt(__tmpDateOb.month) >= parseInt(__dateRawOb.month) && parseInt(__tmpDateOb.month) <= parseInt(__dateRawEndedOb.month)  ) ){
                ___users.push(item)
            }
            
            // if( (`${item?.createdAt}` || "").includes(__date)){
                //     ___users.push(item)
            // }
        }
        dataToReturn.users = ___users;
        allData.users = __users;
        

        // fetch :likes: record per month
        const __likes = await db.likes.findAll()

        let ___likes = [];
        for (let i = 0; i < __likes.length; i++) {
            const item = __likes[i];
            // console.log(`${item.createdAt}`)
            let tmpDate = moment(item.createdAt);
            const __tmpDateOb = {
                day: tmpDate.format('DD'),
                month: tmpDate.format('MM'),
                year: tmpDate.format('YYYY')
            };
            // console.log(__tmpDateOb, ' :log1')

            if( ( parseInt(__tmpDateOb.year) >= parseInt(__dateRawOb.year) && parseInt(__tmpDateOb.year) <= parseInt(__dateRawEndedOb.year) ) &&
            ( parseInt(__tmpDateOb.month) >= parseInt(__dateRawOb.month) && parseInt(__tmpDateOb.month) <= parseInt(__dateRawEndedOb.month) ) ){
                ___likes.push(item)
            }
            // if( (`${item?.createdAt}` || "").includes(__date)){
            //     ___likes.push(item)
            // }
        }
        dataToReturn.likes = ___likes;
        allData.likes = __likes;

        // fetch :comments: record per month
        const __comments = await db.comments.findAll()

        let ___comments = [];
        for (let i = 0; i < __comments.length; i++) {
            const item = __comments[i];
            // console.log(`${item.createdAt}`)
            let tmpDate = moment(item.createdAt);
            const __tmpDateOb = {
                day: tmpDate.format('DD'),
                month: tmpDate.format('MM'),
                year: tmpDate.format('YYYY')
            };
            // console.log(__tmpDateOb, ' :log1')

            if( ( parseInt(__tmpDateOb.year) >= parseInt(__dateRawOb.year) && parseInt(__tmpDateOb.year) <= parseInt(__dateRawEndedOb.year) ) &&
            ( parseInt(__tmpDateOb.month) >= parseInt(__dateRawOb.month) && parseInt(__tmpDateOb.month) <= parseInt(__dateRawEndedOb.month) )){
                ___comments.push(item)
            }
            // if( (`${item?.createdAt}` || "").includes(__date)){
            //     ___comments.push(item)
            // }
        }
        dataToReturn.comments = ___comments;
        allData.comments = __comments;


        // fetch :share: record per month
        const __sharecount = await db.sharecount.findAll()

        let ___sharecount = [];
        for (let i = 0; i < __sharecount.length; i++) {
            const item = __sharecount[i];
            // console.log(`${item.createdAt}`)
            let tmpDate = moment(item.createdAt);
            const __tmpDateOb = {
                day: tmpDate.format('DD'),
                month: tmpDate.format('MM'),
                year: tmpDate.format('YYYY')
            };
            // console.log(__tmpDateOb, ' :log1')

            if( ( parseInt(__tmpDateOb.year) >= parseInt(__dateRawOb.year) && parseInt(__tmpDateOb.year) <= parseInt(__dateRawEndedOb.year) ) &&
            ( parseInt(__tmpDateOb.month) >= parseInt(__dateRawOb.month) && parseInt(__tmpDateOb.month) <= parseInt(__dateRawEndedOb.month) )){
                ___sharecount.push(item)
            }
            // if( (`${item?.createdAt}` || "").includes(__date)){
            //     ___sharecount.push(item)
            // }
        }
        dataToReturn.shares = ___sharecount;
        allData.shares = __sharecount;
        
        

        const stat = {
            users: (dataToReturn.users).length,
            likes: (dataToReturn.likes).length,
            comments: (dataToReturn.comments).length,
            shares: (dataToReturn.shares).length,
        }

        const statAllData = {
            users: (allData.users).length,
            likes: (allData.likes).length,
            comments: (allData.comments).length,
            shares: (allData.shares).length,
        }

        return WrapperResponse("success", {
            message: "Fetched Successfully",
            status: "success",
            // payload: {date: __date.format("YYYY-MM-DD")}
            payload: {
                stat,
                data: dataToReturn,
                allData: {
                    stat: statAllData,
                    data: allData
                }
            }
        }, response)
    } catch (e) {
        console.log(e)
        return WrapperResponse("error", {
            message: "Error",
            status: "failed"
        }, response)
    }
}