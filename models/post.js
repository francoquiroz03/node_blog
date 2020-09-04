const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
        maxlength: 50
    },
    content: {
        type: String,
        trim: true,
        required: true,
        maxlength: 2000
    },
    category: {
        type: ObjectId,
        ref: "Category",
        required: true
    },
    user: {
        type: ObjectId,
        ref: "User",
        required: true
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    tags: {
        type: String,
        trim: true,
        required: false,
        maxlength: 200
    },
    link: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        maxlength: 45
    }
}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);