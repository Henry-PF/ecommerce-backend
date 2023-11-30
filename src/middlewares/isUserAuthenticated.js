exports.isUserAuthenticated = (req, res, next) => {
    console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({
        success: false,
        message: 'Unauthorized: Please log in.',
    });
}

