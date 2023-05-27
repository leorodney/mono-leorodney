import axios from "axios";

// creating a new axios instance with default configs
export const server = axios.create({
    baseURL: `${process.env.VITE_SERVER}:${process.env.VITE_SERVER_PORT}`,
    withCredentials: true,
});

export const endpoints = {
    login: "/login",
    register: "/register",
    promptify: "/promptify",
    production: "/production",
    prompts: "/prompts",
    newPrompt: "/prompts/new",
};