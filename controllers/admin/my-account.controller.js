// [GET] /admin/my-account/
module.exports.index = (req, res) => {
    res.render("admin/pages/my-account.pug", {
        pageTiTle: "Trang thông tin cá nhân",
    });
};
