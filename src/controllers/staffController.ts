import { Request, Response } from "express";
import { WrapperResponse } from "../helper/wrapResponse";
import db from "../../models";
import Joi from "joi";
import { Op } from "sequelize";
import bcryptjs from 'bcryptjs'
import { USER_ROLE, USER_STATUS } from "../config/constants/enum/auth";
import { sendMail } from "../generic/sendMail";
import { generateNewStaffTemplate } from "../templates/mails/new-staff";

const createStaffScheme = {
    email: Joi.string().required().label("Email"),
    password: Joi.string().required().label("Password"),
    first_name: Joi.string().required().label("First Name"),
    last_name: Joi.string().optional().label("Last Name"),
    role_id: Joi.number().required().label("Role Id"),
}

export const fetchStaffRoleController = async (request: Request|any, response: Response)=>{
    try{
        const _data = await db.staffrole.findAll({
            where: {
                status: 1
            }
        })

        return WrapperResponse("success", {
            message: "Fetch Successfully",
            status: "success",
            payload: _data
        }, response)
    }catch(e){
        console.log(e)
        return WrapperResponse("error", {
            message: "An error occurred",
            status: "failed"
        }, response)
    }
}

export const createStaffController = async (request: Request|any, response: Response)=>{
    try {
        const data = request.body;
    
        // validate 
        const {error, value} = Joi.object(createStaffScheme).validate(data)

        if(error){
            return WrapperResponse("error", {
                message: error.message,
                status: "failed"
            }, response)
        }

        value.email = (value.email).toLowerCase();

        // check if user exist
        const user = await db.users.findOne({
            where: {
                [Op.or]: [
                    { email: value.email }
                ]
            }
        });

        if(user){
            return WrapperResponse("error", {
                message: "Account already exist with same email",
                status: "failed"
            }, response)
        }

        const hashPassword = bcryptjs.hashSync(value.password, 8)

        const newUser = await db.users.create({
            email: value.email,
            password: hashPassword,
            first_name: value.first_name,
            last_name: value.last_name,
            role: USER_ROLE.STAFF,
            staffroleId: value.role_id,
            status: USER_STATUS.ACTIVE
        })

        // send mail
        const mailHTML = generateNewStaffTemplate(value.email, value.password);

        await sendMail({
            subject: 'A warm welcome from OviJoy as a new Staff',
            to: value.email,
            html: mailHTML,
        });

        return WrapperResponse("success", {
            message: "Added successfully",
            status: "success",
            payload: newUser
        }, response) 

    } catch (e) {
        console.log(e)
        return WrapperResponse("error", {
            message: "An error occurred",
            status: "failed"
        }, response)   
    }
}

export const getStaffController = async (request: Request|any, response: Response)=>{
    try {
        const _data = await db.users.findAll({
            where: {
                role: USER_ROLE.STAFF,
                [Op.not]: [
                    {status: USER_STATUS.DELETED}
                ]
            },
            include: [db.staffrole]
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

export const toggleStaffStatusController = async (request: Request|any, response: Response)=>{
    try {
        const {id} = request.params;
        const _staff = await db.users.findOne({
            where: {
                id
            }
        })

        if(!_staff){
            return WrapperResponse("error", {
                message: "Account not found",
                status: "failed"
            }, response)
        }

        _staff.status = (USER_STATUS.ACTIVE == _staff.status) ? USER_STATUS.BLOCKED : USER_STATUS.ACTIVE;
        await _staff.save();

        return WrapperResponse("success", {
            message: "Account Status Updated",
            status: "success"
        }, response)

    } catch (e) {
        console.log(e)
        return WrapperResponse("error", {
            message: "An error occurred",
            status: "failed"
        }, response)
    }
}

export const deleteStaffController = async (request: Request|any, response: Response)=>{
    try {
        const {id} = request.params;
        const _staff = await db.users.findOne({
            where: {
                id
            }
        })

        if(!_staff){
            return WrapperResponse("error", {
                message: "Account not found",
                status: "failed"
            }, response)
        }

        _staff.status = USER_STATUS.DELETED;
        await _staff.save();

        return WrapperResponse("success", {
            message: "Account Deleted",
            status: "success"
        }, response)

    } catch (e) {
        console.log(e)
        return WrapperResponse("error", {
            message: "An error occurred",
            status: "failed"
        }, response)
    }
}