const Account = require("../../models/account.model");
const md5 = require("md5");
const systemConfig = require("../../config/system");

// [GET] /admin/auth/login
module.exports.login = (req, res) => {
    res.render("admin/pages/auth/login.pug", {
        pageTitle: "Đăng nhập",
    });
};

// [POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {
    console.log(req.body);

    const email = req.body.email;
    const password = md5(req.body.password);

    const user = await Account.findOne({
        email: email,
        deleted: false,
    });

    if (!user) {
        req.flash("error", "Email không tồn tại");
        res.redirect(`back`);
        return;
    }

    if (password != user.password) {
        req.flash("error", "Mật khẩu không đúng");
        res.redirect(`back`);
        return;
    }

    if (user.status != "active") {
        req.flash("error", "Tài khoản đang bị khóa");
        res.redirect(`back`);
        return;
    }

    res.cookie("token", user.token);
    res.redirect(`/${systemConfig.prefixAdmin}/dashboard`);
};

// [GET] /admin/auth/logout
module.exports.logout = (req, res) => {
    res.clearCookie("token");
    res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
};
