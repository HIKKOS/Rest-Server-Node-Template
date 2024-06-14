const express = require("express");
const cors = require("cors");
class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT ?? 8080;
    this.usersPath = "/api/users";
    this.authPath = "/api/auth";
    this.blogsPath = "/api/blogs";
    //Middlewares
    this.middlewares();
    //rutas de mi apliacion
    this.routes();
  }

  middlewares() {
    //directorio publico
    this.app.use(express.static("public"));
    //cors
    this.app.use(cors());
    //lectura y parse del body
    this.app.use(express.json());
  }
  routes() {
    this.app.use(this.authPath, require("../routes/auth"));
    this.app.use(this.usersPath, require("../routes/users"));
    this.app.use(this.blogsPath, require("../routes/blogs"));
  }
  listen() {
    this.app.listen(this.port, () => {
      console.log("escuchando en el puerto: " + this.port);
    });
  }
}
module.exports = Server;
