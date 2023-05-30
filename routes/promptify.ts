// surprise me route
import { Request, Response } from 'express';
import dotenv from 'dotenv';
import { OpenAIApi } from 'openai';
import { openaiConfig, promptifyConfig } from '../configs';
dotenv.config();

const GPT = new OpenAIApi(openaiConfig);
import "@handy.js/handy";
/**
 * Generate `Prompt` as `Suprise Me Prompt` using the `openai` api and the **`gpt-3`** model
 */
export const promptifyRoute = async (req: Request, res: Response)=>{
    try{
        // sending generated prompts to the client using the openai api and the gpt-3 model
        const GPTResponse = await GPT.createCompletion(promptifyConfig);
        // remove the '\n' and '\t'... characters from the prompt
        const surprisemePrompt = GPTResponse.data.choices[0].text?.escape();
        res.status(200).json({prompt: surprisemePrompt});
        console.log("\t[ SURPRISE ME PROMPT ]: ", surprisemePrompt);
    }
    catch(error){
        console.log(error);
        res.status(500).send();
    }
};
