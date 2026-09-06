import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },

    price: {
        type: Number,
        required: true,
        min: 0,
    },

    thumbnailImage: {
        type: String,
        required: true,
    },

    galleryImages: {
        type: [String],
        required: true,
    },

    category: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Category",
        required: true,
    },

    variants: [
        {
            size: {
                type: String,
                required: true,
                lowercase: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 0,
                default: 0,
            },
        },
    ],

    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    },
}, { timestamps: true });
export const productModel = mongoose.model("product", productSchema);
