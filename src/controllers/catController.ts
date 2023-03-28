import { Request, Response } from "express";
import Joi from "joi";
import db from "../../models";
import { CATEGORY_STATUS } from "../config/constants/enum/category";
import { WrapperResponse } from "../helper/wrapResponse";


export const getCatCategory = async (request: Request|any, response: Response)=>{
    const __data = await db.category.findAll({
        where: {
            status: CATEGORY_STATUS.ACTIVE
        }
    });

    return WrapperResponse("success", {
        message: "Fetched Successfully",
        status: "success",
        payload: __data
    }, response)
}

export const createCatCategory = async (request: Request|any, response: Response)=>{
    try{

        const data = request.body;
    
        // validate 
        const {error, value} = Joi.object({
            category: Joi.string().required().label("category")
        }).validate(data)

        if(error){
            return WrapperResponse("error", {
                message: error.message,
                status: "failed"
            }, response)
        }
        
        const __data = await db.category.create({
            status: CATEGORY_STATUS.ACTIVE,
            name: value.category
        });
    
        return WrapperResponse("success", {
            message: "Created Successfully",
            status: "success",
            payload: __data
        }, response)
    }catch(e){
        return WrapperResponse("error", {
            message: "Error",
            status: "failed"
        }, response)
    }
}

export const deleteCatCategory = async (request: Request|any, response: Response)=>{
    // console.log(request.params.id);

    try{
        // validate 
        const {error, value} = Joi.object({
            id: Joi.number().required().label("category id")
        }).validate(request.params)

        if(error){
            return WrapperResponse("error", {
                message: error.message,
                status: "failed"
            }, response)
        }
        
        await db.category.destroy({
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

export const editCatCategory = async (request: Request|any, response: Response)=>{
    // console.log(request.params.id);

    try{
        // validate 
        const {error, value} = Joi.object({
            id: Joi.number().required().label("category id")
        }).validate(request.params)

        if(error){
            return WrapperResponse("error", {
                message: error.message,
                status: "failed"
            }, response)
        }

        const {error: error1, value: value1} = Joi.object({
            status: Joi.number().required().label("category name"),
            category: Joi.string().required().label("category id")
        }).validate(request.body)

        if(error1){
            return WrapperResponse("error", {
                message: error1.message,
                status: "failed"
            }, response)
        }
        
        const _cat = await db.category.findOne({
            where: {
                id: value.id
            }
        })

        if(!_cat){
            return WrapperResponse("error", {
                message: 'category not found',
                status: "failed"
            }, response)
        }

        _cat.name = value1.category;
        _cat.status = value1.status;
        await _cat.save();
    
        return WrapperResponse("success", {
            message: "Edited Successfully",
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