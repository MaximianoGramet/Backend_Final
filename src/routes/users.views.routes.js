import { Router } from "express";
import UserDto from "../Services/dtos/user.dto.js";
import userModel from "../models/user.model.js";

const router = Router();

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/current", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/users/login");
  }
  res.render("profile", { user: new UserDto(req.session.user) });
});

router.get("/reset-password/:token", (req, res) => {
  const token = req.params.token;
  res.render("reset-password", { token });
});

router.get("/recover-password", (req, res) => {
  res.render("recover-password");
});

router.get("/cart", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/users/login");
  }
  res.render("cart");
});

export default router;
