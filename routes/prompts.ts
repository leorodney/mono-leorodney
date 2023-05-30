import { Request, Response } from 'express';
// mongodb models
import Prompt from '../model/Prompt';

export const promptsRoute = async (req: Request, res: Response)=>{
    try{
        const communityShowcases = await Prompt.find({});
        res.status(200).json(communityShowcases);
    }
    catch(error){
        console.log(error);
        res.status(500).send();
    }
}

export const userPromptsRoute = async (req: Request, res: Response)=>{
    try{
        // finding the user prompts using the prompt author or the user uid,
        // it should be in this order: author, uid; to avoid the error:
        //CastError: Cast to ObjectId failed for value "whybe" (type string) at path "uid" for model "Prompt"

        const userPrompts = await Prompt.find({ author: { $eq: req.params.uid } });
        res.status(200).json(userPrompts);

    } catch(error){
        console.log(error);
        res.status(500).send();
    };
}