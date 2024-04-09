module.exports.createPost = (req, res, next) => {
    if (!req.body.title) {
        req.flash("error", "Nhập tiêu đề cho sản phẩm");
        res.redirect("back");
        return;
    }

    if (req.body.title.length < 5) {
        req.flash("error", "Tiêu đề sản phẩm cần nhiều hơn 4 kí tự");
        res.redirect("back");
        return;
    }

    next();
};
