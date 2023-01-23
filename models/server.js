const express = require('express')
const fileUpload = require('express-fileupload')
const cors = require('cors')
const { dbConnection } = require('../DB/config')
class Server{
    constructor(){
        this.app = express()
        this.port = process.env.PORT
        this.paths = {
            auth: '/api/admin',
            usersPath : '/api/users',
            uploads : '/api/uploads',
            servicios: '/api/servicios',
            tutores: '/api/tutores',
            alumnos: '/api/alumnos'
        }
        //Middlewares
        this.middlewares()
        //rutas de mi apliacion
        this.routes()
        //conectar a la base de datos
        //this.conectarDb()
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
        this.app.use(this.paths.servicios, require('../routes/servicios'))
        this.app.use(this.paths.tutores, require('../routes/tutores'))
        this.app.use(this.paths.alumnos, require('../routes/alumnos'))
    }
    listen(){        
        this.app.listen(this.port, () =>{
            console.log('escuchando en el puerto: ' + this.port);
        })
    }
}
module.exports = Server;