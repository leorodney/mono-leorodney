import { Types } from "mongoose";

declare global {
    namespace Express {
        interface SessionData {
            user: SessionUser;
        }
    }
};

export type SessionUser = {
    authenticated: boolean;
    uid: Types.ObjectId;
    username: string;
    email: string;
    profilePicture: string;
    joined: Date;
};