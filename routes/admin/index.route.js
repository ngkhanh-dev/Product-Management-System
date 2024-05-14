const dashboardRoutes = require("./dashboard.route");
const productRoutes = require("./product.route");
const productCategoryRoutes = require("./product-category.route");
const roleRoutes = require("./role.route");
const accountRoutes = require("./account.route");
const authRoutes = require("./auth.route");
const myAccountRoutes = require("./my-account.route");
const settingRoutes = require("./setting.route");

const authMiddleware = require("../../middlewares/admin/auth.middleware");
const systemConfig = require("../../config/system");

module.exports = (app) => {
    const prefixAdmin = `/${systemConfig.prefixAdmin}`;

    app.use(
        prefixAdmin + "/dashboard",
        authMiddleware.requireAuth,
        dashboardRoutes
    );

    app.use(
        prefixAdmin + "/products",
        authMiddleware.requireAuth,
        productRoutes
    );

    app.use(
        prefixAdmin + "/products-category",
        authMiddleware.requireAuth,
        productCategoryRoutes
    );

    app.use(prefixAdmin + "/roles", authMiddleware.requireAuth, roleRoutes);

    app.use(
        prefixAdmin + "/accounts",
        authMiddleware.requireAuth,
        accountRoutes
    );

    app.use(
        prefixAdmin + "/my-account",
        authMiddleware.requireAuth,
        myAccountRoutes
    );

    app.use(prefixAdmin + "/auth", authRoutes);

    app.use(
        prefixAdmin + "/settings",
        authMiddleware.requireAuth,
        settingRoutes
    );
};
