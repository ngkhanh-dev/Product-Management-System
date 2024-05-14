const express = require("express");
const dotenv = require("dotenv");
const database = require("./config/database");
const systemConfig = require("./config/system");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const path = require("path");
const moment = require("moment");
const http = require("http");
const { Server } = require("socket.io");
dotenv.config();

database.connect();

// Nhúng route
const routeClient = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");

const app = express();
const port = process.env.PORT;

// SocketIO
const server = http.createServer(app);
const io = new Server(server);

global._io = io;

//Nhúng pug
app.set("view engine", "pug");
app.set("views", `${__dirname}/views`);
// app.set("views", `./views`);

//Nhúng express-flash
app.use(cookieParser("keyboard cat"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());

// Nhúng file tĩnh
app.use(express.static(`${__dirname}/public`));
// app.use(express.static(`public`));

//Nhúng Method-override
app.use(methodOverride("_method"));

//Nhúng Body-parser
app.use(bodyParser.urlencoded({ extended: false }));

// App Locals Variable
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;

/* New Route to the TinyMCE Node module */
app.use(
    "/tinymce",
    express.static(path.join(__dirname, "node_modules", "tinymce"))
);

//Routes
routeClient(app);
routeAdmin(app);

app.get("*", (req, res) => {
    res.render("client/pages/errors/404", {
        pageTitle: "404 Not Found",
    });
});

server.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
