import dotenv from 'dotenv';
dotenv.config();
import { Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import Prompt from '../model/Prompt';
import { cloudinaryConfig } from '../configs';

// cloudinary config
cloudinary.config(cloudinaryConfig);

export const promptRoute = async (req: Request, res: Response)=>{
    const { value, img } = req.body;
    try{
        // verfy user is authenticated from auth microservice using axios
        // console.log(req.cookies)
        // console.log(req.headers.cookie)

        // console.log("[AUTH req.session?]: ",req.session?);
        if(!req.session?.user){
            return res.status(401).json({error: 'Not authenticated', ok: false});
        }
        const uploadResponse = await cloudinary.uploader.upload(img, { folder: process.env.CLOUDINARY_FOLDER as string });
        const newPrompt = await Prompt.create({ author: req.session?.user.uid, value, img: uploadResponse.secure_url });
        res.status(201).json(newPrompt);
    }
    catch(error){
        console.log(error);
        res.status(500).send();
    }
};

