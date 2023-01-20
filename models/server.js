const express = require('express')
const fileUpload = require('express-fileupload')
const cors = require('cors')
const { dbConnection } = require('../DB/config')
class Server{
    constructor(){
        this.app = express()
        this.port = process.env.PORT
        this.paths = {
            auth: '/api/users',
            usersPath : '/api/users',
            uploads : '/api/uploads',
        }
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
        //file uploads 
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/'
        }));
    }
    routes(){
        this.app.use(this.paths.auth, require('../routes/auth'))
        this.app.use(this.paths.usersPath, require('../routes/users'))
        this.app.use(this.paths.uploads, require('../routes/uploads'))
    }
    listen(){        
        this.app.listen(this.port, () =>{
            console.log('escuchando en el puerto: ' + this.port);
        })
    }
}
module.exports = Server;