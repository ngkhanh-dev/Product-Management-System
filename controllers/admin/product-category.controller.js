const ProductCategory = require("../../models/product-category.model");
const createTreeHelper = require("../../helpers/createTree.helper");
const systemConfig = require("../../config/system");

// [GET] /products-category/
module.exports.index = async (req, res) => {
    const find = {
        deleted: false,
    };

    const records = await ProductCategory.find(find);

    res.render("admin/pages/products-category/index.pug", {
        pageTitle: "Danh mục sản phẩm",
        records: records,
    });
};

// [GET] /products-category/create
module.exports.create = async (req, res) => {
    const find = {
        deleted: false,
    };

    const records = await ProductCategory.find(find);

    const newRecords = createTreeHelper(records);

    res.render("admin/pages/products-category/create.pug", {
        pageTitle: "Thêm mới danh mục sản phẩm",
        records: newRecords,
    });
};

// [POST] /products-category/create
module.exports.createPost = async (req, res) => {
    if (!res.locals.role.permissions.includes("products-category_create")) {
        res.send("Không có quyền truy cập.");
        return;
    }

    if (req.body.position) {
        req.body.position = parseInt(req.body.position);
    } else {
        const count = await ProductCategory.countDocuments();
        req.body.position = count + 1;
    }

    const record = new ProductCategory(req.body);
    await record.save();

    res.redirect("back");
};

// [GET] /products-category/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const find = {
            _id: req.params.id,
            deleted: false,
        };

        const data = await ProductCategory.findOne(find);
        console.log(data);
        const records = await ProductCategory.find({
            deleted: false,
        });

        const newRecords = createTreeHelper(records);
        res.render(
            `${systemConfig.prefixAdmin}/pages/products-category/edit.pug`,
            {
                pageTitle: "Thêm mới danh mục sản phẩm",
                data: data,
                records: newRecords,
            }
        );
    } catch (error) {
        res.redirect(`/${systemConfig.prefixAdmin}/products-category`);
    }
};

// [GET] /products-category/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;

    req.body.position = parseInt(req.body.position);
    try {
        await ProductCategory.updateOne(
            {
                _id: id,
                deleted: false,
            },
            req.body
        );

        req.flash("success", "Sửa sản phẩm thành công!");
    } catch (error) {
        req.flash("error", "Sửa sản phẩm thất bại!");
    }

    res.redirect("back");
};

// [GET] /products-category/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;

        const productCategory = await ProductCategory.findOne({
            _id: id,
            deleted: false,
        });

        if (productCategory.parent_id) {
            const parentItem = await ProductCategory.findOne({
                _id: productCategory.parent_id,
                deleted: false,
            });

            productCategory.parent = parentItem.title;
        } else {
            productCategory.parent = "";
        }

        res.render("admin/pages/products-category/detail.pug", {
            pageTitle: `Sản phẩm: ${productCategory.title}`,
            productCategory: productCategory,
        });
    } catch (error) {
        console.log(error);
    }
};

// [DELETE] /products-category/detail/:id
module.exports.deleteItem = async (req, res) => {
    try {
        const id = req.params.id;

        await ProductCategory.updateOne(
            {
                _id: id,
            },
            {
                deleted: true,
            }
        );

        res.redirect("back");
    } catch (error) {
        res.redirect(`/${prefixAdmin}/dashboard`);
    }
};
