const mongoose = require('mongoose');
async function connect() {
    try {
        await mongoose.connect(
            'mongodb://localhost:27017/rises',
        );
        console.log('Connect Successfully!!!');
    } catch (error) {
        console.log('Connect fail!!!');
    }
}
module.exports = { connect };
