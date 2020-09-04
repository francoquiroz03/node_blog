const Comment = require("../models/comment");
const { errorHandler } = require("../helpers/dbError");

exports.commentById = (req, res, next, id) => {
    Comment.findById(id).exec((err, comment) => {
        if (err || !comment) {
            return res.status(400).json({
                error: "Comment does not exist"
            });
        }
        req.comment = comment;
        next();
    });
};

exports.create = (req, res) => {

    if (!req.body.description) {
        return res.status(400).json({
            error: "Description is required"
        });
    }

    fields = {};
    fields.description = req.body.description;
    fields.user = req.auth._id;
    fields.post = req.post._id;

    console.log(req);

    const comment = new Comment(fields);
    comment.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({ data });
    });
};

exports.read = (req, res) => {
    return res.json(req.comment);
};

exports.update = (req, res) => {
    const comment = req.comment;

    if (comment.user != req.auth._id) {
        return res.status(400).json({
            error: "Access denied"
        });
    }

    comment.description = req.body.description;
    comment.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
};

exports.remove = (req, res) => {
    const comment = req.comment;

    if (comment.user != req.auth._id) {
        return res.status(400).json({
            error: "Access denied"
        });
    }

    comment.remove((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: "Comment deleted"
        });
    });
};

exports.list = (req, res) => {
    Comment.find().exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
};