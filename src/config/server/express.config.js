import express from "express";
import handlebars from "express-handlebars";
import session from "express-session";
import passport from "passport";
import MongoStore from "connect-mongo";
import { addLogger } from "../../utils/logger.js";
import { __dirname } from "../../utils/utils.js";
import config from "../config.js";
import initializePassport from "../passport.config.js";
import mongoose from "mongoose";
import cors from "cors";
import ProductRouter from "../../routes/products.routes.js";
import CartRouter from "../../routes/carts.routes.js";
import ViewsRouter from "../../routes/views.routes.js";
import UserViewsRouter from "../../routes/users.views.routes.js";
import SessionRouter from "../../routes/session.routes.js";
import githubLoginRouter from "../../routes/github-login.views.routes.js";
import Mockrouter from "../../routes/mock.routes.js";
import UsersRouter from "../../routes/users.routes.js";
import swaggerUiExpress from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

const corsOptions = {
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Access-Control-Allow-Methods",
    "Access-Control-Request-Headers",
  ],
  credentials: true,
  enablePreflight: true,
};

const expressApp = express();
const MONGO_URL = config.urlMongo;
const FRONT_URL = config.urlFront;

expressApp.use(cors(corsOptions));
expressApp.options("*", cors(corsOptions));

expressApp.use(addLogger);
expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: true }));

const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "documentación Coderhouse",
      description: "API para la entrega de swagger",
    },
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
};

expressApp.engine(
  "hbs",
  handlebars.engine({
    runtimeOptions: {
      allowProtoMethodsByDefault: true,
      allowProtoPropertiesByDefault: true,
    },
    extname: ".hbs",
    defaultLayout: "main",
    helpers: {
      eq: function (a, b) {
        return a === b;
      },
      ifEquals: function (arg1, arg2, options) {
        return arg1 === arg2 ? options.fn(this) : options.inverse(this);
      },
    },
  })
);

expressApp.set("view engine", "hbs");
expressApp.set("views", `${__dirname}/views`);

expressApp.use(express.static(`${__dirname}/public`));

expressApp.use(
  session({
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      mongoUrl: MONGO_URL,
      ttl: 10 * 60,
    }),
    secret: "I1ik3C00k13s",
    resave: false,
    saveUninitialized: true,
  })
);
initializePassport();
expressApp.use(passport.initialize());
expressApp.use(passport.session());

const specs = swaggerJSDoc(swaggerOptions);
expressApp.use("/api/products", ProductRouter);
expressApp.use("/api/carts", CartRouter);
expressApp.use("/", ViewsRouter);
expressApp.use("/", Mockrouter);
expressApp.use("/api/sessions", SessionRouter);
expressApp.use("/users", UserViewsRouter);
expressApp.use("/github", githubLoginRouter);
expressApp.use("/api/users", UsersRouter);
expressApp.use(
  "/apidocs",
  swaggerUiExpress.serve,
  swaggerUiExpress.setup(specs)
);

export default expressApp;
