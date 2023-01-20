const dbValidators = require('../helpers/DBvalidators')
const jwtGenerator = require('../helpers/jwtGenerator')
const uploadFile = require('../helpers/uploadFile')
module.exports ={
    ...dbValidators,
    ...jwtGenerator,
    ...uploadFile,
}