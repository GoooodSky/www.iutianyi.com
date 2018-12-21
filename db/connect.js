var mongoose = require('mongoose')

//数据库连接
mongoose.connect('mongodb://127.0.0.1:27017/liutianyi',{ useNewUrlParser: true })

mongoose.connection
    .on('error', (err) => {
        console.log(err)
    })
    .once('open', function () {
        console.log('数据库连接成功')
    });