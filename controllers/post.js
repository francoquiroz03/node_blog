const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const Post = require("../models/post");
const { errorHandler } = require("../helpers/dbError");

exports.postById = (req, res, next, id) => {
    Post.findById(id)
        .populate("category")
        .exec((err, post) => {
            if (err || !post) {
                return res.status(400).json({
                    error: "Post does not exist"
                });
            }
            req.post = post;
            next();
        });
};

exports.read = (req, res) => {
    req.post.photo = undefined;
    return res.json(req.post);
};

exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded"
            });
        }

        const {
            title,
            content,
            category,
            link
        } = fields;

        fields.link = fields.link.toLowerCase();
        fields.link = fields.link.replace(/\s/g, '-');
        fields.user = req.auth._id;

        if (!title ||
            !content ||
            !category ||
            !link
        ) {
            return res.status(400).json({
                error: "All fields are required"
            });
        }

        let post = new Post(fields);

        if (files.photo.type) {
            if (files.photo.size > 10000000) {
                return res.status(400).json({
                    error: "Image should be less than 10mb in size"
                });
            }
            post.photo.data = fs.readFileSync(files.photo.path);
            post.photo.contentType = files.photo.type;

        } else {
            return res.status(400).json({
                error: "Image is require"
            });
        }

        post.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(result);
        });
    });
};

exports.update = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded"
            });
        }

        if (fields.link) {
            fields.link = fields.link.toLowerCase();
            fields.link = fields.link.replace(/\s/g, '-');
        }

        if (req.post.user != req.auth._id) {
            return res.status(400).json({
                error: "Access denied"
            });
        }

        let post = req.post;
        post = _.extend(post, fields);

        if (files.photo) {
            if (files.photo.size > 10000000) {
                return res.status(400).json({
                    error: "Image should be less than 10mb in size"
                });
            }
            post.photo.data = fs.readFileSync(files.photo.path);
            post.photo.contentType = files.photo.type;
        }

        post.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(result);
        });
    });
};

exports.remove = (req, res) => {
    const post = req.post;
    post.remove((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: "Post deleted successfully"
        });
    });
};

exports.list = (req, res) => {
    let order = req.query.order ? req.query.order : "asc";
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    Post.find()
        .select("-photo")
        .populate("category")
        .sort([
            [sortBy, order]
        ])
        .limit(limit)
        .exec((err, posts) => {
            if (err) {
                return res.status(400).json({
                    error: "Post not found"
                });
            }
            res.json(posts);
        });
};

exports.photo = (req, res, next) => {
    if (req.post.photo.data) {
        res.set("Content-Type", req.post.photo.contentType);
        return res.send(req.post.photo.data);
    }
    next();
};

exports.listCategories = (req, res) => {
    Post.distinct("category", {}, (err, categories) => {
        if (err) {
            return res.status(400).json({
                error: "Categories not found"
            });
        }
        res.json(categories);
    });
};