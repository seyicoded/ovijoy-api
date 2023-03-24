import express, { Request, Response} from 'express';
import Joi from 'joi';
import db from '../../models';
import { WrapperResponse } from '../helper/wrapResponse';
import bcryptjs from 'bcryptjs'
import 'dotenv/config'

var jwt = require('jsonwebtoken');

type createUser = {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
}

const createUserScheme = {
    first_name: Joi.string().required().label("First Name"),
    last_name: Joi.string().required().label("Last Name"),
    email: Joi.string().required().label("Email"),
    password: Joi.string().required().label("Password"),
}

type loginUser = {
    email: string;
    password: string;
}

const loginUserScheme = {
    email: Joi.string().required().label("Email"),
    password: Joi.string().required().label("Password"),
}

export const registerController = async (request: Request, response: Response)=>{
    const data: createUser = request.body;
    
    // validate 
    const {error, value} = Joi.object(createUserScheme).validate(data)

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
            email: value.email
        }
    });

    if(user){
        return WrapperResponse("error", {
            message: "User already exist",
            status: "failed"
        }, response)
    }

    const hashPassword = bcryptjs.hashSync(value.password, 8)

    const newUser = await db.users.create({
        email: value.email,
        password: hashPassword,
        first_name: value.first_name,
        last_name: value.last_name,
    })

    if(!newUser){
        return WrapperResponse("error", {
            message: "Error creating user",
            status: "failed"
        }, response)    
    }

    return WrapperResponse("success", {
        message: "User Created Successfully",
        status: "success"
    }, response)
}

export const loginController = async (request: Request, response: Response)=>{
    const data: loginUser = request.body;
    
    // validate 
    const {error, value} = Joi.object(loginUserScheme).validate(data)

    if(error){
        return WrapperResponse("error", {
            message: error.message,
            status: "failed"
        }, response)
    }

    // check if user exist
    const user = await db.users.findOne({
        where: {
            email: value.email
        }
    });

    if(!user){
        return WrapperResponse("error", {
            message: "User doesn't exist",
            status: "failed"
        }, response)
    }

    // compare password
    if(!(bcryptjs.compareSync((value.password), user.password))){
        return WrapperResponse("error", {
            message: "password is incorrect",
            status: "failed"
        }, response)
    }

    // get jwt token
    const jwtToken = jwt.sign({
        data: user
    }, process.env.JWT_SECRET);

    return WrapperResponse("success", {
        message: "login successful",
        payload: {
            token: jwtToken,
            user
        },
        status: "success"
    }, response)
}