const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const Account = require("../../models/account.model");
const filterHelper = require("../../helpers/filter.helper");
const paginationHelper = require("../../helpers/pagination.helper");
const createTreeHelper = require("../../helpers/createTree.helper");
const systemConfig = require("../../config/system");

// [GET] /{prefixAdmin}/products/
module.exports.index = async (req, res) => {
    const find = {
        deleted: false,
    };

    // Filter
    const filterStatus = filterHelper(req);

    if (req.query.status) {
        find.status = req.query.status;
    }
    //End Filter

    // Search
    if (req.query.keyword) {
        const title = new RegExp(req.query.keyword, "i");
        find.title = title;
    }
    // End Search

    // Sort
    const sort = {};

    if (req.query.sortKey && req.query.sortValue) {
        const sortKey = req.query.sortKey;
        const sortValue = req.query.sortValue;
        sort[sortKey] = sortValue;
    } else {
        sort.position = "desc";
    }
    // End Sort

    // Pagination
    const countRecords = await Product.countDocuments(find);
    const objectPagination = paginationHelper(req, countRecords);
    // End Pagination

    const products = await Product.find(find)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip)
        .sort(sort);

    for (const product of products) {
        const createdBy = await Account.findOne({
            _id: product.createdBy,
        });

        product.createdByFullName = createdBy?.fullName;
    }

    res.render("admin/pages/products/index", {
        pageTitle: "Trang tổng quan",
        products: products,
        filterStatus: filterStatus,
        keyword: req.query.keyword,
        objectPagination: objectPagination,
    });
};

// [PATCH] /{prefixAdmin}/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;
    await Product.updateOne(
        {
            _id: id,
        },
        {
            status: status,
        }
    );
    req.flash("success", "Cập nhập thành công trạng thái sản phẩm");
    res.redirect("back");
};

// [PATCH] /{prefixAdmin}/products/change-multi
module.exports.changeMulti = async (req, res) => {
    console.log(req.body);
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
    console.log(type);
    console.log(ids);

    switch (type) {
        case "active":
        case "inactive":
            await Product.updateMany(
                {
                    _id: { $in: ids },
                },
                {
                    status: type,
                }
            );
            req.flash("success", "Cập nhập thành công trạng thái sản phẩm");
            break;
        case "delete-all":
            await Product.updateMany(
                {
                    _id: { $in: ids },
                },
                {
                    deleted: true,
                    deletedAt: new Date(),
                    deletedBy: res.locals.user.id,
                }
            );
            req.flash("success", "Xóa thành công sản phẩm");
            break;
        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split("-");
                position = parseInt(position);

                await Product.updateOne(
                    {
                        _id: id,
                    },
                    {
                        position: position,
                    }
                );
            }
            req.flash("success", "Thay đổi thành công vị trí sản phẩm");
            break;
        default:
            break;
    }
    res.redirect("back");
};

// [DELETE] /{prefixAdmin}/products/delete/:id
module.exports.deleteItemForever = async (req, res) => {
    const id = req.params.id;

    await Product.deleteOne({
        _id: id,
    });

    res.redirect("back");
};

// [DELETE-TRASH] /{prefixAdmin}/products/trash
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;

    await Product.updateOne(
        {
            _id: id,
        },
        {
            deleted: true,
            deletedAt: new Date(),
            deletedBy: res.locals.user.id,
        }
    );

    res.redirect("back");
};

// [GET] /{prefixAdmin}/products/create
module.exports.create = async (req, res) => {
    const category = await ProductCategory.find({
        deleted: false,
    });

    const newCategory = createTreeHelper(category);

    res.render("admin/pages/products/create.pug", {
        pageTitle: "Thêm mới sản phẩm",
        category: newCategory,
    });
};

// [POST] /{prefixAdmin}/products/create
module.exports.createPost = async (req, res) => {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);

    if (req.body.position) {
        req.body.position = parseInt(req.body.position);
    } else {
        const countProducts = await Product.countDocuments();
        req.body.position = countProducts + 1;
    }

    req.body.createdBy = res.locals.user.id;

    const record = new Product(req.body);
    await record.save();

    req.flash("success", "Thêm mới sản phẩm thành công!");
    res.redirect(`/${systemConfig.prefixAdmin}/products`);
};

// [GET] /{prefixAdmin}/products/edit/:id
module.exports.edit = async (req, res) => {
    const id = req.params.id;

    const product = await Product.findOne({
        _id: id,
        deleted: false,
    });

    const category = await ProductCategory.find({
        deleted: false,
    });

    const newCategory = createTreeHelper(category);

    res.render("admin/pages/products/edit.pug", {
        pageTitle: "chỉnh sửa sản phẩm",
        product: product,
        category: newCategory,
    });
};

// [PATCH] /{prefixAdmin}/products/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;

    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = parseInt(req.body.position);
    req.body.updatedBy = res.locals.user.id;

    await Product.updateOne(
        {
            _id: id,
            deleted: false,
        },
        req.body
    );

    req.flash("success", "Sửa sản phẩm thành công!");
    res.redirect(`/${systemConfig.prefixAdmin}/products`);
};

// [GET] /{prefixAdmin}/products/detail/:id
module.exports.detail = async (req, res) => {
    const id = req.params.id;

    const product = await Product.findOne({
        _id: id,
        deleted: false,
    });

    res.render("admin/pages/products/detail.pug", {
        pageTitle: `Sản phẩm: ${product.title}`,
        product: product,
    });
};
