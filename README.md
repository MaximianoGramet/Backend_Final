Configuración de Endpoints en Express

Este archivo README proporciona una descripción general de los diferentes archivos de enrutamiento en una aplicación Express. Los archivos de enrutamiento definen las rutas y controladores para manejar las solicitudes HTTP entrantes en la aplicación.

Archivos de Enrutamiento Configurados:
product.routes.js

Ruta para gestionar productos en la aplicación.
Métodos: GET, POST, PUT, DELETE
Utiliza el controlador ProductController para manejar las operaciones CRUD de productos.
Requiere autenticación para las operaciones de creación, actualización y eliminación.
mock.routes.js

Ruta para generar datos de productos de prueba.
Método: GET
Genera una matriz de productos de prueba y la devuelve como respuesta.
github.routes.js

Ruta para manejar la autenticación con GitHub.
Métodos: GET
Renderiza las vistas para iniciar sesión y mostrar errores durante la autenticación.
cart.routes.js

Ruta para gestionar carritos de compra en la aplicación.
Métodos: GET, POST, PUT, DELETE
Utiliza el controlador CartController para manejar las operaciones CRUD de carritos.
Requiere autenticación de administrador para algunas operaciones.
user.routes.js

Ruta para gestionar usuarios en la aplicación.
Métodos: GET, POST, DELETE
Utiliza Passport.js para la autenticación de usuarios.
Permite el registro, inicio de sesión, cierre de sesión, restablecimiento de contraseña y otras operaciones relacionadas con los usuarios.
Uso:
Cada archivo de enrutamiento define las rutas y los controladores correspondientes para manejar las solicitudes HTTP entrantes relacionadas con su funcionalidad específica.
Algunas rutas requieren autenticación de usuario o de administrador para acceder a ciertas funcionalidades, como la creación, actualización o eliminación de productos, carritos o usuarios.
