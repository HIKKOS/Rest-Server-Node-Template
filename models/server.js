const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const v2 = require;
class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT ?? 8080;
    this.usersPath = "/api/users";
    this.authPath = "/api/login";
    this.blogsPath = "/api/posts";
    //Middlewares
    this.middlewares();
    //rutas de mi apliacion
    this.routes();
  }

  middlewares() {
    //directorio publico
    this.app.use(express.static("public"));
    this.app.use(
      bodyParser.json({
        extended: true,
        limit: "50mb",
      })
    );
    //cors
    this.app.use(cors());
    //lectura y parse del body
    this.app.use(express.json());
  }
  routes() {
    this.app.use(morgan("dev"));
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
