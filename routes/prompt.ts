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
        if(!req.session?.user){
            return res.status(401).json({error: 'Not authenticated', ok: false});
        }
        const uploadResponse = await cloudinary.uploader.upload(img, { folder: process.env.CLOUDINARY_FOLDER as string });
        const newPrompt = await Prompt.create({ uid: req.session?.user.uid, author: req.session?.user.username, value, img: uploadResponse.secure_url });
        res.status(201).json(newPrompt);
    }
    catch(error){
        console.error(error);
        res.status(500).send();
    }
};

/**
 * update the like of a prompt
 */
export const likePromptRoute = async (req: Request, res: Response)=>{
    const { id, type }: { id: string, type: "like" | "unlike" } = req.body;
    try{
        // verfy user is authenticated from auth microservice using axios
        if(!req.session?.user) return res.status(401).json({error: 'Not authenticated', ok: false});

        const prompt = await Prompt.findById(id);
        
        if(!prompt) return res.status(404).json({error: 'Prompt not found', ok: false});

        // increment the like count of the prompt
        type == "like" ? prompt.likes += 1 : prompt.likes -= 1 ;
        prompt.likes < 0 ? prompt.likes = 0 : prompt.likes; 
        await prompt.save();
        res.status(200).json(prompt);

    } catch(error) {
        console.error(error);
        res.status(500).send();
    }
}

/**
 * update the download of a prompt
 */
export const downloadPromptRoute = async (req: Request, res: Response)=>{
    const { id } = req.body;
    try{
        // verfy user is authenticated from auth microservice using axios
        if(!req.session?.user) return res.status(401).json({error: 'Not authenticated', ok: false});

        const prompt = await Prompt.findById(id);
        
        if(!prompt) return res.status(404).json({error: 'Prompt not found', ok: false});

        // increment the download count of the prompt
        prompt.downloads += 1;
        await prompt.save();
        res.status(200).json(prompt);

    } catch(error) {
        console.error(error);
        res.status(500).send();
    }
}