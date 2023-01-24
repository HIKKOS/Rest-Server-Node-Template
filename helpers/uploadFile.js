const path = require('path');
const { v4: uuidv4 } = require('uuid');
uuidv4();

const uploadFile = ( files, extensionesValidas = ['png', 'jpg', 'jpeg'], folder = '' ) => {
    return new Promise( (resolve, reject) => {

        const { archivo } = files
        const nombreCoratdo = archivo.name.split('.')
        const extension = nombreCoratdo[nombreCoratdo.length - 1]
        //validar la extension
        if( !extensionesValidas.includes(extension) ){
            return reject(`La extension ${extension} no es permitida`)
        }
   
        const nombreTemp = `${uuidv4()}.${extension}`
        const uploadPath = path.join( __dirname, '../uploads/',folder ,nombreTemp)
        
        archivo.mv(uploadPath, (err) => {
            if (err) {
                return reject(err)
            }  
            resolve( nombreTemp )
        })
    })
}

module.exports = {
    uploadFile,

}