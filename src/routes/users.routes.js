import { Router } from "express";
import UsuarioDTO from "../Services/dtos/user.dto.js";
import userModel from "../models/user.model.js";
import uploadMiddleware from "../middleware/multer/multer.middleware.js";
import { deletedUsersMail } from "../utils/nodemailer.js";

const router = Router();

router.get("/premium/:uid", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/users/login");
  }
  try {
    const userId = req.params.uid;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).send("User not found");
    }

    if (!req.files || req.files.length >= 3) {
      return res
        .status(400)
        .json({ status: "error", message: "You must attach 3 files or more" });
    }

    user.roll = user.roll === "user" ? "premium" : "user";
    await user.save();

    res.render("profile", { user: new UserDto(user) });
  } catch (error) {
    console.error("Error at changing user roll:", error);
    res.status(500).send("Internal server error");
  }
});

router.post("/:uid/documents/", uploadMiddleware, async (req, res) => {
  const { fileName, filePath } = req.uploadedFile;
  res.status(200).json({ fileName, filePath });
});

router.get("/usuarios", async (req, res) => {
  try {
    const usuarios = await userModel.find();

    const usuariosDTO = usuarios.map(
      (usuario) =>
        new UsuarioDTO({
          name: usuario.first_name,
          last_name: usuario.last_name,
          email: usuario.email,
          age: usuario.age,
          rol: usuario.roll,
        })
    );
    res.json(usuariosDTO);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/eliminar-usuarios-inactivos", async (req, res) => {
  try {
    const lastConnections = new Date();
    lastConnections.setDate(lastConnections.getDate() - 2);

    const usuariosAEliminar = await userModel.find({
      last_connection: { $lte: lastConnections },
      roll: { $ne: "admin" },
    });
    for (const usuario of usuariosAEliminar) {
      await deletedUsersMail(usuario.email, usuario.first_name);
    }

    const deleted = await userModel.deleteMany({
      last_connection: { $lte: lastConnections },
      roll: { $ne: "admin" },
    });

    res.json({
      message: `Se eliminaron ${deleted.deletedCount} usuarios inactivos.`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
