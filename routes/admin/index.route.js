const dashboardRoutes = require("./dashboard.route");
const productRoutes = require("./product.route");
const systemConfig = require("../../config/system");

module.exports = (app) => {
    const prefixAdmin = `/${systemConfig.prefixAdmin}`;

    app.use(prefixAdmin + "/dashboard", dashboardRoutes);

    app.use(prefixAdmin + "/products", productRoutes);
};
