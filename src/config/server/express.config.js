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

const expressApp = express();
const MONGO_URL = config.urlMongo;

expressApp.use(addLogger);
expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: true }));

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

export default expressApp;
