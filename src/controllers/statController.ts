import { Request, Response } from "express";
import { WrapperResponse } from "../helper/wrapResponse";
import moment from "moment";
import db from "../../models";
import { Op } from "sequelize";
import { USER_ROLE, USER_STATUS } from "../config/constants/enum/auth";

export const fetchAnalyticsController = async (request: Request|any, response: Response)=>{
    try {
        const { date = 'now' } = request.query;
        // console.log((new Date()).toISOString())
        // console.log((new Date(date)).toDateString(), "before")
        const __date = moment((new Date(date)).toDateString()).format("MMMM DD YYYY");
        console.log(__date+'%', "after")
        
        const dataToReturn = {
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
            console.log(`${item.createdAt}`)
            if( (`${item?.createdAt}` || "").includes(__date)){
                ___users.push(item)
            }
        }
        dataToReturn.users = ___users;
        
        // fetch :likes: record per month
        const __likes = await db.likes.findAll()

        let ___likes = [];
        for (let i = 0; i < __likes.length; i++) {
            const item = __likes[i];
            console.log(`${item.createdAt}`)
            if( (`${item?.createdAt}` || "").includes(__date)){
                ___likes.push(item)
            }
        }
        dataToReturn.likes = ___likes;

        // fetch :comments: record per month
        const __comments = await db.comments.findAll()

        let ___comments = [];
        for (let i = 0; i < __comments.length; i++) {
            const item = __comments[i];
            console.log(`${item.createdAt}`)
            if( (`${item?.createdAt}` || "").includes(__date)){
                ___comments.push(item)
            }
        }
        dataToReturn.comments = ___comments;
        
        

        const stat = {
            users: (dataToReturn.users).length,
            likes: (dataToReturn.likes).length,
            comments: (dataToReturn.comments).length,
            shares: (dataToReturn.shares).length,
        }

        return WrapperResponse("success", {
            message: "Fetched Successfully",
            status: "success",
            // payload: {date: __date.format("YYYY-MM-DD")}
            payload: {
                stat,
                data: dataToReturn,
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