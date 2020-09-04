const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const commentSchema = new mongoose.Schema({
    description: {
        type: String,
        trim: true,
        required: true,
        maxlength: 200
    },
    user: {
        type: ObjectId,
        ref: "User",
        required: true
    },
    post: {
        type: ObjectId,
        ref: "Post",
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model("Comment", commentSchema);