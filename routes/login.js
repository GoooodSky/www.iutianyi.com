var express = require('express');
var router = express.Router();
var path = require('path');

var usersModel = require('../db/users');


router.get('/', function (req, res, next) {
    res.sendFile(path.join(__dirname, '../pages/login.html'));
});

router.post('/verify', function (req, res, next) {
    var user = req.body.params

    usersModel
        .findOne({
            name: user.name
        })
        .exec((error, result) => {
            if (error || result == null) {
                res.send({
                    login: false,
                    code : "该账号不存在"
                })
                return
            }
            if (result.password == user.password) {
                req.session.user = user.name
                res.send({
                    login: true
                })
            } else {
                res.send({
                    login: false,
                    code : "密码错误"
                })
            }


        })


    // if(user.name == admin && user.password == password){
    //     req.session.user = req.body.params.user
    //     res.send({
    //         login : true
    //     })
    // }
    // else{
    //     res.send({
    //         login : false
    //     })
    // }

});

module.exports = router;