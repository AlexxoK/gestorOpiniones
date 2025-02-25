import { Schema, model } from "mongoose";

const CommentSchema = new Schema(
    {
        content: {
            type: String,
            required: [true, "El comentario no puede estar vacío!"],
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        publicacion: {
            type: Schema.Types.ObjectId,
            ref: "Publicacion",
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default model("Comment", CommentSchema);