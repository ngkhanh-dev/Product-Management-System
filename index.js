const express = require("express");
const dotenv = require("dotenv");
const database = require("./config/database");
const systemConfig = require("./config/system");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");
dotenv.config();

database.connect();

// Nhúng route
const routeClient = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");

const app = express();
const port = process.env.PORT;

//Nhúng pug
app.set("view engine", "pug");
app.set("views", "./views");

//Nhúng express-flash
app.use(cookieParser("keyboard cat"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());

// Nhúng file tĩnh
app.use(express.static("public"));

//Nhúng Method-override
app.use(methodOverride("_method"));

//Nhúng Body-parser
app.use(bodyParser.urlencoded({ extended: false }));

// App Locals Variable
app.locals.prefixAdmin = systemConfig.prefixAdmin;

//Routes
routeClient(app);
routeAdmin(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
