
const jwtGenerator = require('../helpers/jwtGenerator')
const uploadFile = require('../helpers/uploadFile')
module.exports ={
    
    ...jwtGenerator,
    ...uploadFile,
}