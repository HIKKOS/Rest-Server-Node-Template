const express = require('express')
const cors = require('cors')
const { dbConnection } = require('../DB/config')
class Server{
    constructor(){
        this.app = express()
        this.port = process.env.PORT
        this.usersPath = '/api/users'
        this.authPath = '/api/auth'
        //Middlewares
        this.middlewares()
        //rutas de mi apliacion
        this.routes()
        //conectar a la base de datos
        this.conectarDb()
    }
    async conectarDb() {
        await dbConnection();
    }
    middlewares(){
        //directorio publico
        this.app.use( express.static('public') )
        //cors
        this.app.use( cors() )
        //lectura y parse del body
        this.app.use( express.json() );
    }
    routes(){
        this.app.use(this.authPath, require('../routes/auth'))
        this.app.use(this.usersPath, require('../routes/users'))
    }
    listen(){        
        this.app.listen(this.port, () =>{
            console.log('escuchando en el puerto: ' + this.port);
        })
    }
}
module.exports = Server;