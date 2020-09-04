exports.userSignupValidator = (req, res, next) => {
    req.check("name", "Name is required").notEmpty();
    req.check("email", "Email must be between 3 to 32 characters")
        .matches(/.+\@.+\..+/)
        .withMessage("Email must contain @")
        .isLength({
            min: 4,
            max: 32
        });
    req.check("phone", "Phone must be between 9 to 11 numbers")
        .matches(/^\d+$/)
        .withMessage("Phone must contain only numbers")
        .isLength({
            min: 9,
            max: 11
        });
    req.check("password", "Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must contain at least 6 characters")
        .matches(/\d/)
        .withMessage("Password must contain a number");
    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next();
};

exports.postCreateValidator = (req, res, next) => {
    req.check("title", "Title is required")
        .withMessage("Title must be between 1 to 50 characters")
        .isLength({
            min: 1,
            max: 50
        });
    req.check("content", "Content is required")
        .isLength({
            min: 1,
            max: 2000
        })
        .withMessage("Content must be between 1 to 2000 characters");
    req.check("category", "Must be assign a Category").notEmpty();
    req.check("user", "User is required").notEmpty();
    req.check("tags", "Tags is required")
        .isLength({ max: 200 })
        .withMessage("Tags must be max 200 characters");
    req.check("link", "Link is required")
        .isLength({
            min: 5,
            max: 45
        })
        .withMessage("Link must be between 5 to 45 characters");

    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next();
};

exports.categoryCreateValidator = (req, res, next) => {
    req.check("name", "Name is required")
        .isLength({
            min: 5,
            max: 45
        })
        .withMessage("Name must be between 5 to 45 characters");
    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next();
};