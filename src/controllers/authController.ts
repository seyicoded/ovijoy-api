import express, { Request, Response} from 'express';
import Joi from 'joi';
import db from '../../models';
import { WrapperResponse } from '../helper/wrapResponse';
import bcryptjs from 'bcryptjs'
import 'dotenv/config'
import { generateOtp } from '../generic/functions';
import { sendMail } from '../generic/sendMail';
import { generateOtpMailTemplate } from '../templates/mails/otp';
import { generateSmsUseCase, sendSMS } from '../generic/termii';

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

const userExist = async (email: string)=>{
    const _user = await db.users.findOne({
        where: {
            email: (email || "").toLowerCase()
        }
    });

    if(_user){
        return {
            exist: true,
            user: _user
        }
    }else{
        return {
            exist: false
        }
    }
}

export const requestEmailOtpController = async (request: Request, response: Response)=>{
    const {error, value} = Joi.object({
        email: Joi.string().email().required().label("Email"),
    }).validate(request.body)

    if(error){
        return WrapperResponse("error", {
            message: error.message,
            status: "failed"
        }, response)
    }

    if( (await userExist(value.email)).exist ){
        // account already exist
        return WrapperResponse("error", {
            message: "Account already exist",
            status: "failed"
        }, response)
    }

    // generate otp and send
    const otp = await generateOtp(6);
    const mailHTML = generateOtpMailTemplate(otp);
    await sendMail({
        subject: 'OviJoy Registration OTP',
        to: value.email,
        html: mailHTML,
    });


    return WrapperResponse("success", {
        message: "OTP SENT",
        status: "success",
        payload: {
            otp
        }
    }, response)
}

export const requestPhoneOtpController = async (request: Request, response: Response)=>{
    const {error, value} = Joi.object({
        cc: Joi.string().required().label("Country Code"),
        phone: Joi.string().required().label("Phone Number"),
    }).validate(request.body)

    if(error){
        return WrapperResponse("error", {
            message: error.message,
            status: "failed"
        }, response)
    }
    
    // send otp to phone number then return data
    const otp = await generateOtp(6);
    const sent = await sendSMS({
        sms: generateSmsUseCase(otp),
        to: `${value.cc}${value.phone}`
    })

    if(!sent){
        return WrapperResponse("error", {
            message: "Termii rejected this sms",
            status: "failed",
            payload: {
                otp
            }
        }, response)
    }

    return WrapperResponse("success", {
        message: "OTP SENT",
        status: "success",
        payload: {
            otp
        }
    }, response)
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