const mongoose = require('mongoose')
const dbConnection = async () =>{
    try {
        await mongoose.connect(process.env.MONGODB_CNN)
        console.log('database online')
    } catch (error) {
        console.log('-------------')
        console.log(error);
        console.log('-------------')
        throw new Error('database error')
    }
}

module.exports = {
    dbConnection
}