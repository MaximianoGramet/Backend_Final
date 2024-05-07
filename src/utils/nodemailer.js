import nodemailer from "nodemailer";
import config from "../config/config.js";

async function sendPasswordResetEmail(email, resetToken) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
      user: "matoleto2@gmail.com",
      pass: config.gmailPassword,
    },
  });

  // URL para restablecer la contraseña (cambia 'tudominio.com' según corresponda)
  const resetUrl = `http://localhost:8080/users/reset-password/${resetToken}`;

  const mailOptions = {
    from: "Productos locos de Maxi",
    to: email,
    subject: "Recuperación de Contraseña",
    html: `
            <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.</p>
            <p>Si no solicitaste esto, puedes ignorar este correo electrónico.</p>
            <p>Si deseas restablecer tu contraseña, haz clic en el siguiente enlace:</p>
            <a href="${resetUrl}">${resetUrl}</a>
            <p>Este enlace expirará en 30 minutos.</p>
        `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(
      "Correo electrónico de recuperación de contraseña enviado correctamente."
    );
  } catch (error) {
    console.error(
      "Error al enviar el correo electrónico de recuperación de contraseña:",
      error
    );
  }
}

export default sendPasswordResetEmail;

export async function deleteProductMail(email, productName) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
      user: "matoleto2@gmail.com",
      pass: config.gmailPassword,
    },
  });

  const mailOptions = {
    from: "Productos locos de Maxi",
    to: email,
    subject: "Eliminacion de Producto",
    html: `
            <p>Hemos recibido una solicitud para borrar un producto tuyo llamado ${productName}.</p>
            <p>Si no solicitaste esto, puedes ignorar este correo electrónico.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Correo electrónico de eliminación de producto enviado.");
  } catch (error) {
    console.error(
      "Error al enviar el correo electrónico de eliminación de producto:",
      error
    );
  }
}

export async function deletedUsersMail(email, username) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
      user: "matoleto2@gmail.com",
      pass: config.gmailPassword,
    },
  });

  const mailOptions = {
    from: "Productos locos de Maxi",
    to: email,
    subject: "Eliminacion de Cuenta",
    html: `
              <p>Estimado/a ${username} a quien nos dirigimos.</p>
              <p>Si estás viendo este correo es porque debido a tu inactividad hemos tomado</p>
              <p>la dura desicion de borrar tu cuenta bajo el correo ${email} para siempre</p>
              <p>lamentamos mucho esta perdida y deseamos volver a verte</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(
      `Correo electrónico de eliminación de cuentas a ${email} enviado exitosamente`
    );
  } catch (error) {
    console.error(
      `Error al enviar el correo electrónico de eliminación de cuenta a: ${email}`,
      error
    );
  }
}
