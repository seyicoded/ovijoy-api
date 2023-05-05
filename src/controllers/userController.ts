import { Request, Response } from "express"
import db from "../../models"
import { USER_ROLE, USER_STATUS } from "../config/constants/enum/auth"
import { Op } from "sequelize"
import { WrapperResponse } from "../helper/wrapResponse"

export const getUsersController = async (request: Request|any, response: Response)=>{
    try {
        const _data = await db.users.findAll({
            where: {
                role: USER_ROLE.USER,
                [Op.not]: [
                    {status: USER_STATUS.DELETED}
                ]
            },
        })

        return WrapperResponse("success", {
            message: "Fetch Successfully",
            status: "success",
            payload: _data
        }, response)
    } catch (e) {
        console.log(e)
        return WrapperResponse("error", {
            message: "An error occurred",
            status: "failed"
        }, response)  
    }
}