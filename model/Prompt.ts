import { Schema, model } from 'mongoose';

const Prompt = new Schema({
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    value: { type: String, required: true },
    img: { type: String, required: true },
    likes: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
},{ 
    timestamps: true
});

export default model("Prompt", Prompt);