var express = require('express');
var router = express.Router();
var marked = require('marked');

var artilcesModel = require('../database/articles');
var projectsModel = require('../database/projects');
var visitorsModel = require('../database/visitors');

function getIP(req) {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (ip.substr(0, 7) == "::ffff:") {
        ip = ip.substr(7)
    }
    return ip
}

function getDate() {
    var d = new Date();
    return d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate()
}

router.get('/', function (req, res) {
    res.send('This is API');
});
// 查询文章列表，用于首页的列表展示，根据标签，排序，分页等信息返回相应结果
router.get('/getArticleList', function (req, res) {
    var articlesPerPage = Number(req.query.articlesPerPage)
    var currentPage = (req.query.currentPage - 1) * articlesPerPage
    // sortType view love sortOrder 1 -1
    var sortType = req.query.sortType
    var sortOrder = req.query.sortOrder
    var sort = {
        date: -1
    }
    if (sortType == 'date') sort = {
        date: sortOrder
    }
    if (sortType == 'view') sort = {
        view: sortOrder
    }
    if (sortType == 'love') sort = {
        love: sortOrder
    }

    // 分类查询条件
    var tagName = req.query.tagName
    if (tagName == '全部') {
        var findPinned = {
            pinned: true
        }
        var findUnpinned = {
            pinned: false
        }
    } else {
        var findPinned = {
            pinned: true,
            tag: tagName
        }
        var findUnpinned = {
            pinned: false,
            tag: tagName
        }
    }
    artilcesModel
        .find(findPinned)
        .sort(sort)
        .exec(function (err, articlePinned) {
            if (err) return console.error(err);
            artilcesModel
                .find(findUnpinned)
                .sort(sort)
                .exec(function (err, articleUnpinned) {
                    if (err) return console.error(err);

                    var articlesList = articlePinned.concat(articleUnpinned)
                    var articlesListLength = articlesList.length
                    articlesList = articlesList.slice(currentPage, (currentPage + articlesPerPage > articlesList.length) ? undefined : articlesPerPage)
                    articlesList = articlesList.map(function (e) {
                        e.view = e.viewer.length
                        e.love = e.lover.length
                        return e
                    })
                    res.send({
                        articlesList,
                        articlesListLength
                    })
                })
        })

});
// 根据id获取文章详情
router.get('/getArticle/:key', function (req, res, next) {
    var key = req.params.key
    artilcesModel
        .findOne({
            _id: key
        })
        .exec(function (err, data) {
            if (err) {
                res.send({
                    title: '文章不存在鸭！'
                })
            } else {
                var article = data
                var viewer = article.viewer
                viewer.push({
                    "date": getDate(),
                    "ip": getIP(req)
                })
                data.viewer = viewer
                data.save()
                article.content = marked(article.content)
                article.view = data.viewer.length
                article.love = data.lover.length
                res.send(article)
            }
        })
});
// 查询标签列表
router.get('/getTagList', function (req, res) {

    new Promise(function (resolve, reject) {
        var tags = []
        var tagAll = 0
        artilcesModel
            .distinct("tag")
            .exec(function (err, tagList) {
                if (err) return reject(err);
                tagList.forEach(e => {
                    artilcesModel
                        .find({
                            tag: e
                        })
                        .exec(function (err, data) {
                            if (err) return reject(err);
                            tags.push({
                                tagName: e,
                                tagCount: data.length
                            })
                            tagAll += data.length
                            // console.log(flag)
                            // 当查询完所有tags的数量（该数量为tagList.length）时，将总数添加到数组，并resolve(tags)
                            if (tags.length == tagList.length) {
                                tags.unshift({
                                    tagName: '全部',
                                    tagCount: tagAll
                                })
                                resolve(tags)
                            }

                        })
                });
            })

    }).then(function (tags) {
        // console.log(tags)
        // 对结果进行排序，阅读量大的考前，总数一定最大，除非只有一个标签
        tags.sort(function (a, b) {
            return b.tagCount - a.tagCount
        })
        res.send({
            tags: tags
        })
    })
});
// 获取项目列表
router.get('/getProjectList', function (req, res) {

    let projectsPerPage = Number(req.query.projectsPerPage)
    let start = (req.query.currentPage - 1) * projectsPerPage

    projectsModel
        .find()
        .exec(function (err, data) {
            if (err) console.error(err)
            let length = data.length
            let projects = data.slice(start, (start + projectsPerPage > length) ? undefined : projectsPerPage)
            res.send({
                projects,
                length
            })
        })
});
// 文章点赞
router.get('/loveArtilce', function (req, res) {
    var id = req.query.id
    // artilcesModel.findByIdAndUpdate(id, {
    //     $inc: {
    //         love: 1
    //     }
    // }, (err, doc) => {
    //     if (err) {
    //         console.log("Something wrong when updating data!");
    //     }
    //     res.send('You have Loved')
    // })
    artilcesModel
        .findOne({
            _id: id
        })
        .exec(function (err, data) {
            var loverTemp = data.lover
            loverTemp.push({
                "date": getDate(),
                "ip": getIP(req)
            })
            data.lover = loverTemp
            data.save()
            res.send('You have Loved')
        })
});
// 记录访客信息并返回pv给前端
router.get('/vistor', function (req, res) {
    var date = getDate()
    var ip = getIP(req)
    var agent = req.headers['user-agent']
    visitorsModel
        .create({
            ip: ip,
            date: date,
            agent: agent,
        })
        .then(function () {
            visitorsModel
                .find({
                    date: date
                })
                .distinct("ip")
                .exec(function (err, todayView) {
                    if (err) console.error(err)
                    res.send({
                        pv: todayView.length,
                        index: todayView.indexOf(ip) + 1
                    })
                })
        })
});

module.exports = router;