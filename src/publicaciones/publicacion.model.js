import { Schema, model } from "mongoose";

const PublicacionSchema = Schema({
    tittle: {
        type: String,
        required: [true, "Tittle is required!"],
        maxLength: 3000,
    },

    categories: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Category'
        }
    ],

    text: {
        type: String,
        required: [true, "Text is required!"],
        maxLength: [5000, "5000 characters maximum!"],
    },

    status: {
        type: Boolean,
        default: true
    },

    userId: {
        type: Schema.Types.ObjectId,
        ref: "Usuario",
        required: true
    }

}, {
    timestamps: true,
    versionKey: false
});

export default model('Publicacion', PublicacionSchema);