import { Request, Response } from "express";
import Joi from "joi";
import db from "../../models";
import { CATEGORY_STATUS } from "../config/constants/enum/category";
import { WrapperResponse } from "../helper/wrapResponse";
import fs from 'fs'
import path from 'path'
import { POST_STATUS } from "../config/constants/enum/others";
// import formidable from 'formidable'
const formidable = require('formidable');


export const createPostCategory = async (request: Request|any, response: Response)=>{
    try{

        const data = request.body;

        const _path = __dirname + '/../../uploads/posts';
        const form = formidable({ 
            multiples: true,
            uploadDir: _path,
         });
        
        form.parse(request, async (err, fields, files) => {
            if (err) {
                return WrapperResponse("error", {
                    message: "Error",
                    status: "failed"
                }, response)
            //   response.writeHead(err.httpCode || 400, { 'Content-Type': 'text/plain' });
            //   response.end(String(err));
              return;
            }

            const {newFilename, mimetype: fileType} = files.media;

            const {error, value} = Joi.object({
                caption: Joi.string().required().label("caption"),
                hashtags: Joi.string().required().label("hashtags"),
                country: Joi.string().required().label("country"),
            }).validate(fields)
    
            if(error){
                return WrapperResponse("error", {
                    message: error.message,
                    status: "failed"
                }, response)
            }


            // create file
            const __user = (request.user);
            const __post = await db.post.create({
                caption: value.caption,
                media: `uploads/posts/${newFilename}`,
                mediaType: fileType,
                hashtags: value.hashtags,
                country: value.country,
                status: POST_STATUS.ACTIVE,
                userId: __user.id
            })

            // __post.add(__user)

            // console.log(__dirname+ '/../../uploads/posts')
            // await fs.mkdir(_path, (err)=>{
            //     console.log(err)
            // });
            // fs.rename(`${files.media.filepath}/${files.media.newFilename}`, `${_path}/${files.media.newFilename}`, (err)=>{
            //     console.log(err)
            // })
        
            // response.writeHead(200, { 'Content-Type': 'application/json' });
            // response.end(JSON.stringify({ fields, files }, null, 2));

            return WrapperResponse("success", {
                message: "Created Successfully",
                status: "success",
            }, response)
            
        });
        
    }catch(e){
        return WrapperResponse("error", {
            message: "Error",
            status: "failed"
        }, response)
    }
}